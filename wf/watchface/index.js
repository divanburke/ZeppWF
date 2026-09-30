/*
 * Zepp WF — Amazfit Bip 6
 *
 * 390 x 450
 * Black AMOLED-first design with a bright green retro-tech accent.
 * The large time uses image digits so the face keeps a consistent,
 * wide display font instead of relying on the system text font.
 */

const W = 390
const H = 450

const BG = 0x050607
const GREEN = 0xB8FF63
const GREEN_DIM = 0x35511F
const WHITE = 0xF2F4ED
const MUTED = 0x68705E
const PANEL = 0x10130F

const ROOT = 'assets/digits/'

function text(x, y, w, h, value, size, color, align) {
  return hmUI.createWidget(hmUI.widget.TEXT, {
    x,
    y,
    w,
    h,
    text: value,
    text_size: size,
    color,
    align_h: align === undefined ? hmUI.align.CENTER_H : align,
    align_v: hmUI.align.CENTER_V
  })
}

function arc(x, y, size, start, end, width, color) {
  return hmUI.createWidget(hmUI.widget.ARC, {
    x,
    y,
    w: size,
    h: size,
    radius: size / 2 - width / 2,
    start_angle: start,
    end_angle: end,
    line_width: width,
    color
  })
}

WatchFace({
  onInit() {
    console.log('Zepp WF init')
  },

  build() {
    this.buildFace()
  },

  onDestroy() {
    console.log('Zepp WF destroy')
  },

  buildFace() {
    // Base.
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: W,
      h: H,
      color: BG
    })

    // Outer technical ring.
    arc(8, 8, 374, -86, 86, 2, GREEN_DIM)
    arc(8, 8, 374, 94, 266, 2, GREEN_DIM)

    // Small top status marks.
    text(24, 18, 90, 20, 'BIP 6', 13, MUTED, hmUI.align.LEFT)
    text(276, 18, 90, 20, 'AMOLED', 13, MUTED, hmUI.align.RIGHT)

    // Left/right micro tick marks.
    for (let i = 0; i < 5; i++) {
      const y = 78 + i * 25
      hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: 18,
        y,
        w: i === 2 ? 18 : 10,
        h: 2,
        color: i === 2 ? GREEN : GREEN_DIM
      })
      hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: 362 - (i === 2 ? 18 : 10),
        y,
        w: i === 2 ? 18 : 10,
        h: 2,
        color: i === 2 ? GREEN : GREEN_DIM
      })
    }

    // Large digital time.
    hmUI.createWidget(hmUI.widget.IMG_TIME, {
      hour_zero: 1,
      hour_startX: 32,
      hour_startY: 96,
      hour_array: this.digits(),
      hour_space: -2,
      hour_unit_en: ROOT + 'colon.png',
      hour_align: hmUI.align.LEFT,
      minute_follow: 1,
      minute_startX: 216,
      minute_startY: 96,
      minute_array: this.digits(),
      minute_space: -2,
      minute_align: hmUI.align.LEFT
    })

    // Date / day line.
    text(36, 220, 318, 27, 'WED  30 SEP  2026', 20, WHITE)

    // Central divider.
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 34,
      y: 254,
      w: 322,
      h: 2,
      color: GREEN_DIM
    })

    // Lower circular data modules.
    this.metricRing(96, 335, 52, 210, 326, '72', '%', 'BATTERY')
    this.metricRing(294, 335, 52, 214, 316, '84', '', 'PAI')

    // Middle lower strip.
    text(136, 291, 118, 22, 'STEPS', 13, MUTED)
    text(132, 312, 126, 32, '6 428', 25, WHITE)

    // Tiny bottom labels.
    text(24, 414, 150, 18, 'HEART   68', 12, MUTED, hmUI.align.LEFT)
    text(216, 414, 150, 18, 'TEMP   21°', 12, MUTED, hmUI.align.RIGHT)

    // Accent baseline.
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 34,
      y: 438,
      w: 322,
      h: 3,
      color: GREEN
    })
  },

  digits() {
    return [
      ROOT + '0.png',
      ROOT + '1.png',
      ROOT + '2.png',
      ROOT + '3.png',
      ROOT + '4.png',
      ROOT + '5.png',
      ROOT + '6.png',
      ROOT + '7.png',
      ROOT + '8.png',
      ROOT + '9.png'
    ]
  },

  metricRing(cx, cy, radius, start, end, value, unit, label) {
    arc(cx - radius, cy - radius, radius * 2, 0, 360, 5, PANEL)
    arc(cx - radius, cy - radius, radius * 2, start, end, 5, GREEN)

    text(cx - 48, cy - 20, 96, 28, value, 24, WHITE)
    text(cx - 48, cy + 7, 96, 16, unit, 12, GREEN)
    text(cx - 62, cy + radius + 7, 124, 18, label, 11, MUTED)
  }
})