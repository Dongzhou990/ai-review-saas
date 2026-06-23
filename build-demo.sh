#!/bin/bash
# 口碑助手演示视频生成脚本
# 使用 ffmpeg 创建 Ken Burns 效果 + 文字叠加 + 场景过渡

FFMPEG="/opt/homebrew/bin/ffmpeg"
DIR="/Users/xiaobinggan/ai-review-saas/public"
OUT="$DIR/demo-professional.mp4"
TMP="/tmp/kuki-demo-build"
rm -rf "$TMP"; mkdir -p "$TMP"

W=1440; H=900; FPS=25
FONT="/System/Library/Fonts/PingFang.ttc"
# Fallback fonts
if [ ! -f "$FONT" ]; then FONT="/System/Library/Fonts/Supplemental/Arial.ttf"; fi

# ═══════════════════════════════════════
# Helper: create a scene segment with Ken Burns + text
# ═══════════════════════════════════════
scene() {
  local name=$1 img=$2 duration=$3 zoom=$4 text=$5 text2=$6 textY=$7
  local posX=${8:-"(w-text_w)/2"}
  
  echo "  🎬 $name (${duration}s)"

  # Ken Burns zoom: scale from 1.0 to 1.0+zoom, with slight pan
  local end_zoom=$(echo "1 + $zoom" | bc)
  local mid_dur=$(echo "$duration / 2" | bc)

  local vf="scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:black"
  
  if [ -n "$text" ]; then
    vf="$vf,zoompan=z='1+${zoom}*on/${FPS}/${duration}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${FPS}*${duration}:s=${W}x${H}:fps=${FPS},drawtext=fontfile='${FONT}':text='${text}':fontcolor=#e8e8f0:fontsize=36:fontweight=bold:x=${posX}:y=${textY}:shadowcolor=black:shadowx=2:shadowy=2"
  else
    vf="$vf,zoompan=z='1+${zoom}*on/${FPS}/${duration}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${FPS}*${duration}:s=${W}x${H}:fps=${FPS}"
  fi

  $FFMPEG -y -loop 1 -i "$img" -vf "$vf" -t "$duration" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 "$TMP/${name}.mp4" 2>/dev/null
}

# ═══════════════════════════════════════
# Generate each scene
# ═══════════════════════════════════════

# Scene 1: Intro (black background with title) - 4s
echo "🎬 开场"
$FFMPEG -y -f lavfi -i "color=c=0x060608:s=${W}x${H}:d=4:r=${FPS}" \
  -vf "drawtext=fontfile='${FONT}':text='口碑助手':fontcolor=#e8e8f0:fontsize=64:fontweight=bold:x=(w-text_w)/2:y=(h-text_h)/2-30:shadowcolor=black@0.5:shadowx=3:shadowy=3,drawtext=fontfile='${FONT}':text='AI 智能回复差评 · 一站式口碑管理':fontcolor=#6b6b80:fontsize=24:x=(w-text_w)/2:y=(h-text_h)/2+40" \
  -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 "$TMP/s0-intro.mp4" 2>/dev/null

# Scene 2: Landing page - 8s
# Can't do two separate drawtext easily in one pass, so add subtitle in a second pass
$FFMPEG -y -loop 1 -i "$DIR/screenshot-01-landing.png" \
  -vf "zoompan=z='1+0.06*on/${FPS}/8':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${FPS}*8:s=${W}x${H}:fps=${FPS},drawtext=fontfile='${FONT}':text='顾客差评太多，回复不过来？':fontcolor=#e8e8f0:fontsize=34:fontweight=bold:x=60:y=50:shadowcolor=black:shadowx=2:shadowy=2,drawtext=fontfile='${FONT}':text='每一条差评都在影响你的店铺评分':fontcolor=#6b6b80:fontsize=18:x=60:y=100" \
  -t 8 -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 "$TMP/s1-landing.mp4" 2>/dev/null

# Scene 3: Solution - 4s (same image, different text)
$FFMPEG -y -loop 1 -i "$DIR/screenshot-01-landing.png" \
  -vf "zoompan=z='1+0.04*on/${FPS}/4':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${FPS}*4:s=${W}x${H}:fps=${FPS},drawtext=fontfile='${FONT}':text='AI 帮你 30 秒':fontcolor=#06b6d4:fontsize=40:fontweight=bold:x=60:y=50:shadowcolor=black:shadowx=2:shadowy=2,drawtext=fontfile='${FONT}':text='一键生成专业回复':fontcolor=#e8e8f0:fontsize=34:fontweight=bold:x=60:y=105" \
  -t 4 -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 "$TMP/s2-solution.mp4" 2>/dev/null

# Scene 4: Review page - 12s (show the 3 steps)
$FFMPEG -y -loop 1 -i "$DIR/screenshot-03-reviews.png" \
  -vf "zoompan=z='1+0.08*on/${FPS}/12':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${FPS}*12:s=${W}x${H}:fps=${FPS},drawtext=fontfile='${FONT}':text='核心功能：AI 智能回复差评':fontcolor=#7c3aed:fontsize=22:fontweight=bold:x=(w-text_w)/2:y=30:shadowcolor=black:shadowx=2:shadowy=2,drawtext=fontfile='${FONT}':text='① 粘贴顾客差评':fontcolor=#e8e8f0:fontsize=28:fontweight=bold:x=w-380:y=200,drawtext=fontfile='${FONT}':text='② 选择回复风格':fontcolor=#e8e8f0:fontsize=28:fontweight=bold:x=w-380:y=320,drawtext=fontfile='${FONT}':text='③ AI 一键生成专业回复':fontcolor=#06b6d4:fontsize=28:fontweight=bold:x=w-380:y=440" \
  -t 12 -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 "$TMP/s3-review.mp4" 2>/dev/null

# Scene 5: Styles showcase - 6s
$FFMPEG -y -f lavfi -i "color=c=0x060608:s=${W}x${H}:d=6:r=${FPS}" \
  -vf "drawtext=fontfile='${FONT}':text='多种回复风格可选':fontcolor=#7c3aed:fontsize=24:fontweight=bold:x=(w-text_w)/2:y=60,drawtext=fontfile='${FONT}':text='🤝 诚恳道歉':fontcolor=#e8e8f0:fontsize=30:x=(w-text_w)/2:y=200,drawtext=fontfile='${FONT}':text='💼 专业解释':fontcolor=#e8e8f0:fontsize=30:x=(w-text_w)/2:y=330,drawtext=fontfile='${FONT}':text='💛 温暖关怀':fontcolor=#e8e8f0:fontsize=30:x=(w-text_w)/2:y=460,drawtext=fontfile='${FONT}':text='😄 幽默化解':fontcolor=#e8e8f0:fontsize=30:x=(w-text_w)/2:y=590" \
  -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 "$TMP/s4-styles.mp4" 2>/dev/null

# Scene 6: Dashboard - 8s
$FFMPEG -y -loop 1 -i "$DIR/screenshot-05-dashboard.png" \
  -vf "zoompan=z='1+0.06*on/${FPS}/8':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${FPS}*8:s=${W}x${H}:fps=${FPS},drawtext=fontfile='${FONT}':text='好评邀约 + 数据看板':fontcolor=#e8e8f0:fontsize=34:fontweight=bold:x=(w-text_w)/2:y=40:shadowcolor=black:shadowx=2:shadowy=2,drawtext=fontfile='${FONT}':text='评分趋势 · 回复效果 · 一目了然':fontcolor=#6b6b80:fontsize=20:x=(w-text_w)/2:y=90" \
  -t 8 -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 "$TMP/s5-dashboard.mp4" 2>/dev/null

# Scene 7: Outro CTA - 5s
$FFMPEG -y -f lavfi -i "color=c=0x060608:s=${W}x${H}:d=5:r=${FPS}" \
  -vf "drawtext=fontfile='${FONT}':text='开启智能口碑管理':fontcolor=#e8e8f0:fontsize=52:fontweight=bold:x=(w-text_w)/2:y=(h-text_h)/2-30:shadowcolor=black:shadowx=3:shadowy=3,drawtext=fontfile='${FONT}':text='让 AI 帮你高效处理每一条顾客评价':fontcolor=#6b6b80:fontsize=22:x=(w-text_w)/2:y=(h-text_h)/2+40,drawtext=fontfile='${FONT}':text='reviewai.chat':fontcolor=#06b6d4:fontsize=24:fontweight=bold:x=(w-text_w)/2:y=(h-text_h)/2+90" \
  -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 "$TMP/s6-outro.mp4" 2>/dev/null

echo "---"
echo "📦 拼接场景..."

# Create concat file with crossfade transitions
$FFMPEG -y \
  -i "$TMP/s0-intro.mp4" \
  -i "$TMP/s1-landing.mp4" \
  -i "$TMP/s2-solution.mp4" \
  -i "$TMP/s3-review.mp4" \
  -i "$TMP/s4-styles.mp4" \
  -i "$TMP/s5-dashboard.mp4" \
  -i "$TMP/s6-outro.mp4" \
  -filter_complex "
    [0:v][1:v]xfade=transition=fade:duration=0.6:offset=3.4[f1];
    [f1][2:v]xfade=transition=fade:duration=0.5:offset=11.0[f2];
    [f2][3:v]xfade=transition=fade:duration=0.5:offset=14.6[f3];
    [f3][4:v]xfade=transition=fade:duration=0.5:offset=26.2[f4];
    [f4][5:v]xfade=transition=fade:duration=0.5:offset=31.8[f5];
    [f5][6:v]xfade=transition=fade:duration=0.6:offset=39.4[f6]
  " -map "[f6]" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 20 -movflags +faststart "$OUT" 2>/dev/null

echo "✅ 完成!"
ls -lh "$OUT"
echo ""
/opt/homebrew/bin/ffprobe -v error -show_entries format=duration -of default "$OUT"
echo "Total scenes: 7"
echo "Output: $OUT"
