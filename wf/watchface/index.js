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

    // Large live digital time.
    this.timeSensor = hmSensor.createSensor(hmSensor.id.TIME)
    this.timeText = text(22, 90, 346, 112, '', 92, GREEN)
    this.timeText.setProperty(hmUI.prop.MORE, {
      text_style: hmUI.text_style.NONE,
      char_space: -3
    })

    this.dateText = text(36, 220, 318, 27, '', 20, WHITE)

    this.updateTime()
    this.timeSensor.addEventListener(hmSensor.event.MINUTEEND, () => {
      this.updateTime()
    })

    // Live system data.
    this.battery = hmSensor.createSensor(hmSensor.id.BATTERY)
    this.batteryText = text(34, 414, 150, 18, '', 12, MUTED, hmUI.align.LEFT)
    this.updateBattery()
    this.battery.addEventListener(hmSensor.event.CHANGE, () => {
      this.updateBattery()
    })

    this.steps = hmSensor.createSensor(hmSensor.id.STEP)
    this.stepsText = text(136, 312, 126, 32, '', 25, WHITE)
    this.updateSteps()
    this.steps.addEventListener(hmSensor.event.CHANGE, () => {
      this.updateSteps()
    })

    this.heart = hmSensor.createSensor(hmSensor.id.HEART)
    this.heartText = text(216, 414, 150, 18, '', 12, MUTED, hmUI.align.RIGHT)
    this.updateHeart()
    this.heart.addEventListener(hmSensor.event.CHANGE, () => {
      this.updateHeart()
    })

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

    // Accent baseline.
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 34,
      y: 438,
      w: 322,
      h: 3,
      color: GREEN
    })
  },

  updateTime() {
    const t = this.timeSensor
    const hour = String(t.format_hour).padStart(2, '0')
    const minute = String(t.minute).padStart(2, '0')
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

    this.timeText.setProperty(hmUI.prop.MORE, {
      text: hour + ':' + minute
    })

    this.dateText.setProperty(hmUI.prop.MORE, {
      text: days[t.week - 1] + '  ' + String(t.day).padStart(2, '0') + ' ' + months[t.month - 1] + '  ' + t.year
    })
  },

  updateBattery() {
    this.batteryText.setProperty(hmUI.prop.MORE, {
      text: 'BATTERY   ' + this.battery.current + '%'
    })
  },

  updateSteps() {
    const value = String(this.steps.current).replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
    this.stepsText.setProperty(hmUI.prop.MORE, {
      text: value
    })
  },

  updateHeart() {
    const value = this.heart.current
    this.heartText.setProperty(hmUI.prop.MORE, {
      text: 'HEART   ' + (value > 0 ? value : '--')
    })
  },

  metricRing(cx, cy, radius, start, end, value, unit, label) {
    arc(cx - radius, cy - radius, radius * 2, 0, 360, 5, PANEL)
    arc(cx - radius, cy - radius, radius * 2, start, end, 5, GREEN)

    text(cx - 48, cy - 20, 96, 28, value, 24, WHITE)
    text(cx - 48, cy + 7, 96, 16, unit, 12, GREEN)
    text(cx - 62, cy + radius + 7, 124, 18, label, 11, MUTED)
  }
})