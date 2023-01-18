/** @type {import('tailwindcss').Config} */
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
        status_banner_height: theme('extra.status_banner_height'),
      }),
      fontSize: ({theme}) => ({
        status_banner_height: theme('extra.status_banner_height'),
        status_banner_height_half: 'calc(' + theme('extra.status_banner_height') + ' / 2)',
        status_banner_height_quarter: 'calc(' + theme('extra.status_banner_height') + ' / 4)'
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
            card: '#C4C4C4',
            background: 'white'
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
