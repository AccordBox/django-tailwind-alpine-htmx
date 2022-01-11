const Path = require("path");
const pwd = process.env.PWD;

// To make tailwind can scan code in Python packages:
// export pySitePackages=$(python3 -c "import sysconfig; print(sysconfig.get_path('purelib'))")
const pySitePackages = process.env.pySitePackages;

// We can add current project paths here
const projectPaths = [
  Path.join(pwd, "../django_tailwind_app/templates/**/*.html"),
  // add js file paths if you need
];

// We can add 3-party python packages here
let pyPackagesPaths = []
if (pySitePackages){
  pyPackagesPaths = [
    Path.join(pySitePackages, "./crispy_tailwind/**/*.html"),
    Path.join(pySitePackages, "./crispy_tailwind/**/*.py"),
    Path.join(pySitePackages, "./crispy_tailwind/**/*.js"),
  ];
}

const contentPaths = [...projectPaths, ...pyPackagesPaths];
console.log(`tailwindcss will scan ${contentPaths}`);

module.exports = {
  content: contentPaths,
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
