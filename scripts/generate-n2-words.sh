#!/bin/bash
# 批量生成N2词条 Etymology数据
# 用法: bash scripts/generate-n2-words.sh
# 输出: scripts/output/n2-words.json

SEEDS="scripts/n2-seeds.json"
OUTPUT="scripts/output/n2-words.json"
CLAUDE="${LOOMI_CLAUDE_BIN:-claude}"

mkdir -p scripts/output

COUNT=$(jq 'length' "$SEEDS")
echo "共 $COUNT 个种子词，开始生成..."

echo "[" > "$OUTPUT"
FIRST=true

for i in $(seq 0 $((COUNT - 1))); do
  WORD=$(jq -r ".[$i].japanese" "$SEEDS")
  READING=$(jq -r ".[$i].reading" "$SEEDS")
  MEANING=$(jq -r ".[$i].meaning_zh" "$SEEDS")

  echo "[$((i+1))/$COUNT] 生成: $WORD ($READING)"

  PROMPT="你是日语词典编辑，请为以下日语词汇生成完整的词源解析数据，以严格JSON格式输出（不要有任何markdown代码块，直接输出JSON对象）：

词汇：$WORD
读音：$READING
中文释义：$MEANING
JLPT级别：N2

输出JSON结构：
{
  \"id\": \"n2_${WORD}_${i}\",
  \"japanese\": \"$WORD\",
  \"reading\": \"$READING\",
  \"meaning_zh\": \"$MEANING\",
  \"meaning_en\": \"（英文释义）\",
  \"jlpt_level\": \"N2\",
  \"drama_id\": null,
  \"scene_context\": \"（一句话说明此词在现代日语中的典型使用场景，50字内）\",
  \"etymology\": {
    \"origin_type\": \"kango\",
    \"kanji_breakdown\": [
      {
        \"kanji\": \"（第一个汉字）\",
        \"reading\": \"（音读）\",
        \"meaning\": \"（单字含义）\",
        \"origin\": \"（来自中文的哪个字，有什么历史）\",
        \"zh_modern\": \"（对应的现代中文字）\"
      }
    ],
    \"related_words\": [\"（3-5个相关词）\"],
    \"zh_comparison\": \"（与中文用法的相同点或差异，50字内）\",
    \"interesting_fact\": \"（关于此词的有趣知识点，如词源故事、常见误用、文化背景等，60字内）\"
  }
}"

  RESULT=$("$CLAUDE" --print --model claude-haiku-4-5-20251001 "$PROMPT" 2>/dev/null)

  # 提取JSON（去掉可能的markdown包裹）
  JSON=$(echo "$RESULT" | sed 's/```json//g' | sed 's/```//g' | tr -d '\n' | grep -o '{.*}' | head -1)

  if [ -z "$JSON" ]; then
    echo "  ⚠️ 第 $((i+1)) 个词生成失败，跳过"
    continue
  fi

  if [ "$FIRST" = true ]; then
    FIRST=false
  else
    echo "," >> "$OUTPUT"
  fi

  echo "$JSON" >> "$OUTPUT"
  sleep 0.5
done

echo "]" >> "$OUTPUT"
echo ""
echo "✅ 完成！输出文件: $OUTPUT"
echo "请用 jq '.' $OUTPUT 检查格式，然后手动决定是否合并到 words.ts"
