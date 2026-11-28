<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

/** Defaults mirror src/config.class.js: [color code or '', style code or '']. */
const DEFAULTS: Record<string, [string, string]> = {
  success: ['32', ''],
  fail: ['31', ''],
  warn: ['33', ''],
  error: ['31', ''],
  info: ['', ''],
  log: ['', ''],
  alert: ['91', ''],
  crit: ['35', ''],
  warning: ['33', ''],
  debug: ['90', ''],
  silly: ['', '2']
}

/** Same order as the level table in the docs: by console method. */
const LEVELS = ['silly', 'debug', 'log', 'info', 'success', 'warn', 'warning', 'fail', 'alert', 'error', 'crit']

const SYMBOLS: Record<string, string> = {
  success: '✅', fail: '📛', warn: '🟠', error: '🚨', info: '📄', log: '📄',
  alert: '😡', crit: '😱', warning: '⚠️', debug: '🛠️', silly: '🤪'
}

const MESSAGES: Record<string, string> = {
  silly: 'wheee',
  debug: 'x = 42',
  log: 'Something happened',
  info: 'Server listening on port 3000',
  success: 'Build finished',
  warn: 'Config file missing, using defaults',
  warning: 'Disk usage above 80%',
  fail: 'Retry 3 of 3 failed',
  alert: 'Action required',
  error: 'Database connection failed',
  crit: 'System is down'
}

const COLORS: { code: string; name: string; hex: string }[] = [
  { code: '', name: 'Default', hex: '' },
  { code: '30', name: 'Black (30)', hex: '#4d4d4d' },
  { code: '31', name: 'Red (31)', hex: '#e5534b' },
  { code: '32', name: 'Green (32)', hex: '#57ab5a' },
  { code: '33', name: 'Yellow (33)', hex: '#c69026' },
  { code: '34', name: 'Blue (34)', hex: '#539bf5' },
  { code: '35', name: 'Magenta (35)', hex: '#b083f0' },
  { code: '36', name: 'Cyan (36)', hex: '#39c5cf' },
  { code: '37', name: 'White (37)', hex: '#d0d7de' },
  { code: '90', name: 'Gray (90)', hex: '#8b949e' },
  { code: '91', name: 'Bright red (91)', hex: '#ff7b72' },
  { code: '92', name: 'Bright green (92)', hex: '#7ee787' },
  { code: '93', name: 'Bright yellow (93)', hex: '#f2cc60' },
  { code: '94', name: 'Bright blue (94)', hex: '#79c0ff' },
  { code: '95', name: 'Bright magenta (95)', hex: '#d2a8ff' },
  { code: '96', name: 'Bright cyan (96)', hex: '#a5f3fc' },
  { code: '97', name: 'Bright white (97)', hex: '#ffffff' }
]

const STYLES = [
  { code: '', name: 'None' },
  { code: '1', name: 'Bold (1)' },
  { code: '2', name: 'Dim (2)' },
  { code: '3', name: 'Italic (3)' },
  { code: '4', name: 'Underline (4)' }
]

const state = reactive(Object.fromEntries(LEVELS.map((l) => [l, { color: DEFAULTS[l][0], style: DEFAULTS[l][1] }])))
const includeAll = ref(false)
const copyStatus = ref('')

/** The escape code logmoji would receive; "0" (reset) stands for the terminal default, as in logmoji's own defaults. */
function ansi(level: string) {
  const { color, style } = state[level]
  const parts = [style, color].filter(Boolean)
  return `\\x1b[${parts.length ? parts.join(';') : '0'}m`
}

function changed(level: string) {
  return state[level].color !== DEFAULTS[level][0] || state[level].style !== DEFAULTS[level][1]
}

const config = computed(() => {
  const rows = LEVELS.filter((l) => includeAll.value || changed(l)).map((l) => `    ${l}: "${ansi(l)}",`)
  if (!rows.length) return '// Every level uses its default color. Change one above.\nconst logger = require("logmoji")();'
  return ['const logger = require("logmoji")({', '  logColors: {', ...rows, '  },', '});'].join('\n')
})

function lineStyle(level: string) {
  const { color, style } = state[level]
  const hex = COLORS.find((c) => c.code === color)?.hex
  return {
    color: hex || undefined,
    fontWeight: style === '1' ? '700' : undefined,
    opacity: style === '2' ? '0.6' : undefined,
    fontStyle: style === '3' ? 'italic' : undefined,
    textDecoration: style === '4' ? 'underline' : undefined
  }
}

function label(level: string) {
  return level.charAt(0).toUpperCase() + level.slice(1) + ':'
}

function reset() {
  for (const l of LEVELS) {
    state[l].color = DEFAULTS[l][0]
    state[l].style = DEFAULTS[l][1]
  }
  copyStatus.value = ''
}

async function copy() {
  try {
    await navigator.clipboard.writeText(config.value)
    copyStatus.value = 'Copied to the clipboard.'
  } catch {
    copyStatus.value = 'Copying is blocked in this browser. Select the code and copy it by hand.'
  }
}
</script>

<template>
  <div class="lcp">
    <div class="lcp-grid">
      <div class="lcp-levels">
        <div v-for="level in LEVELS" :key="level" class="lcp-row">
          <span class="lcp-name"><code>{{ level }}</code></span>
          <label class="lcp-field">
            <span class="lcp-sr">Color for {{ level }}</span>
            <select v-model="state[level].color">
              <option v-for="c in COLORS" :key="c.code" :value="c.code">{{ c.name }}</option>
            </select>
          </label>
          <label class="lcp-field">
            <span class="lcp-sr">Style for {{ level }}</span>
            <select v-model="state[level].style">
              <option v-for="s in STYLES" :key="s.code" :value="s.code">{{ s.name }}</option>
            </select>
          </label>
        </div>
        <div class="lcp-actions">
          <button type="button" class="lcp-btn lcp-alt" @click="reset">Reset to defaults</button>
        </div>
      </div>

      <div class="lcp-output">
        <p class="lcp-caption">Preview, with the default emojis and labels</p>
        <div class="lcp-term" aria-label="Terminal preview">
          <div v-for="level in LEVELS" :key="level" class="lcp-line" :style="lineStyle(level)">
            {{ SYMBOLS[level] }} {{ label(level) }} {{ MESSAGES[level] }}
          </div>
        </div>
      </div>
    </div>

    <div class="lcp-config">
      <div class="lcp-config-head">
        <p class="lcp-caption">Your logColors config</p>
        <label class="lcp-check"><input v-model="includeAll" type="checkbox" /> Include unchanged levels</label>
      </div>
      <pre class="lcp-code"><code>{{ config }}</code></pre>
      <div class="lcp-actions">
        <button type="button" class="lcp-btn" @click="copy">Copy config</button>
        <span class="lcp-status" role="status">{{ copyStatus }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lcp {
  margin: 24px 0;
}
.lcp-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: 16px;
}
.lcp-row {
  display: grid;
  grid-template-columns: 68px minmax(0, 1fr) minmax(0, 0.8fr);
  gap: 8px;
  align-items: center;
  margin-bottom: 6px;
}
.lcp-field select {
  width: 100%;
  padding: 4px 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
}
.lcp-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
.lcp-caption {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.lcp-term {
  background: #0d1117;
  color: #e6edf3;
  border-radius: 8px;
  padding: 14px 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.8;
  overflow-x: auto;
}
.lcp-line {
  white-space: pre;
}
.lcp-config {
  margin-top: 20px;
}
.lcp-config-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}
.lcp-check {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.lcp-code {
  margin: 0;
  background: var(--vp-code-block-bg);
  border-radius: 8px;
  padding: 14px 16px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}
.lcp-code code {
  font-family: var(--vp-font-family-mono);
  background: none;
  padding: 0;
}
.lcp-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}
.lcp-btn {
  padding: 6px 14px;
  border-radius: 20px;
  background: var(--vp-c-brand-3);
  color: var(--vp-c-white);
  font-size: 14px;
  font-weight: 600;
}
.lcp-btn:hover {
  background: var(--vp-c-brand-2);
}
.lcp-alt {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}
.lcp-alt:hover {
  background: var(--vp-c-default-2);
}
.lcp-status {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
@media (max-width: 760px) {
  .lcp-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
