/**
 * N2词库批量生成脚本
 * 运行: node scripts/generate-n2-words.mjs
 * 输出: scripts/output/n2-words.json（人工审核后再决定合并）
 */
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const seeds = JSON.parse(readFileSync(join(__dirname, 'n2-seeds.json'), 'utf8'))
const CLAUDE = process.env.LOOMI_CLAUDE_BIN || 'claude'
const OUTPUT = join(__dirname, 'output', 'n2-words.json')

mkdirSync(join(__dirname, 'output'), { recursive: true })

const results = []

for (let i = 0; i < seeds.length; i++) {
  const { japanese, reading, meaning_zh } = seeds[i]
  console.log(`[${i + 1}/${seeds.length}] 生成: ${japanese} (${reading})`)

  const prompt = `你是日语词典编辑，为以下N2词汇生成词源解析，严格按JSON格式输出，不要加markdown代码块：

词汇：${japanese}
读音：${reading}
中文释义：${meaning_zh}

输出以下JSON结构（直接输出，不要有\`\`\`包裹）：
{
  "id": "n2_${i}_${reading.replace(/[^a-z]/gi, '')}",
  "japanese": "${japanese}",
  "reading": "${reading}",
  "meaning_zh": "${meaning_zh}",
  "meaning_en": "英文释义",
  "jlpt_level": "N2",
  "scene_context": "典型使用场景一句话说明（40字内）",
  "etymology": {
    "origin_type": "kango",
    "kanji_breakdown": [
      {
        "kanji": "第一个汉字",
        "reading": "音读假名",
        "meaning": "单字含义",
        "origin": "汉字来源说明（20字内）",
        "zh_modern": "对应现代中文字"
      }
    ],
    "related_words": ["相关词1", "相关词2", "相关词3"],
    "zh_comparison": "与中文用法的相同或差异（40字内）",
    "interesting_fact": "趣味知识点或文化背景（50字内）"
  }
}`

  try {
    const raw = execSync(
      `${CLAUDE} --print --model claude-haiku-4-5-20251001`,
      {
        input: prompt,
        encoding: 'utf8',
        timeout: 30000,
        env: process.env,
      }
    )

    // 提取JSON：去掉markdown代码块
    const cleaned = raw
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim()

    // 找到第一个完整的JSON对象
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start === -1 || end === -1) {
      console.warn(`  ⚠️ 无法提取JSON，跳过`)
      continue
    }
    const jsonStr = cleaned.slice(start, end + 1)
    const parsed = JSON.parse(jsonStr)
    results.push(parsed)
    console.log(`  ✓ 成功`)
  } catch (e) {
    console.warn(`  ⚠️ 失败: ${e.message?.slice(0, 80)}`)
  }

  // 每5个词保存一次，防止意外中断丢失
  if ((i + 1) % 5 === 0) {
    writeFileSync(OUTPUT, JSON.stringify(results, null, 2), 'utf8')
    console.log(`  💾 已保存 ${results.length} 条`)
  }
}

writeFileSync(OUTPUT, JSON.stringify(results, null, 2), 'utf8')
console.log(`\n✅ 完成！共生成 ${results.length}/${seeds.length} 条`)
console.log(`📁 输出文件: ${OUTPUT}`)
console.log(`\n请检查内容后，手动决定是否合并到 lib/data/words.ts`)
