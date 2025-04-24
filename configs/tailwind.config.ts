import type { Config } from 'tailwindcss'

import primeui from 'tailwindcss-primeui'

export default <Partial<Config>>{
  theme: {},
  plugins: [primeui],

  content: ['../src/**/*.{js,ts,vue}']
}
