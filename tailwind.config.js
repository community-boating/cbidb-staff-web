/** @type {import('tailwindcss').Config} */

function addPrefix(themeableItem, prefix){
  const withPrefix = {};
  Object.entries(themeableItem).forEach((a) => {
    withPrefix[prefix + a[0]] = a[1];
  })
  return withPrefix;
}

const headerFontSizeFactor = "1.25";

const winddirSizeFactor = ".62";

function headerSizes(theme){
  return {
    status_banner_height: 'calc(' + theme('extra.status_banner_height') + ')',
    status_banner_height_half: 'calc(' + theme('extra.status_banner_height') + ' / 2)',
    status_banner_height_quarter: 'calc(' + theme('extra.status_banner_height') + ' / 4)',
    status_banner_height_winddir: 'calc(' + theme('extra.status_banner_height') + ' * ' + winddirSizeFactor + ' )',
    status_banner_font: 'calc(' + theme('extra.status_banner_height') + ' * ' + headerFontSizeFactor + ')',
    status_banner_font_half: 'calc(' + theme('extra.status_banner_height') + ' * ' + headerFontSizeFactor + ' / 2.1)',
    status_banner_font_quarter: 'calc(' + theme('extra.status_banner_height') + ' * ' + headerFontSizeFactor + ' / 4)',
    status_banner_font_winddir: 'calc(' + theme('extra.status_banner_height') + ' * ' + headerFontSizeFactor + ' * ' + winddirSizeFactor + ')'
  }
}

module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.{html,js,css,ts,tsx,scss}',
    './public/index.html'
  ],
  
  theme: {
    extend: {
      spacing: ({ theme }) => ({
        '1': '.5mm',
        '2': '1mm',
        'primary': '2mm',
        'card': '1mm',
        'input': '1.7em',
        'icon_button': '1.5em',
        ...headerSizes(theme)
      }),
      fontSize: ({theme}) => ({
        ...headerSizes(theme)
      })
    },
  },
  plugins: [
    require('tailwindcss-themer')({
      defaultTheme: {
        // put the default values of any config you want themed
        // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
        extend: {
          // colors is used here for demonstration purposes
          colors: {
            primary: 'red',
            boathouseblue: '#00507D',
            card: '#CCCCCC',
            background: '#E3E3E3'
          },
          fontFamily: {
            primary: ['Roboto']
          },
          extra: {
            status_banner_height: "15mm",
          },
        }
      },
      themes: [
        {
          // name your theme anything that could be a valid css selector
          // remember what you named your theme because you will use it as a class to enable the theme
          name: 'my-theme',
          // put any overrides your theme has here
          // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
          extend: {
            colors: {
              primary: 'blue'
            }
          },
        }
      ]
    })
  ],
}
