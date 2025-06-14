const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
    .js('resources/js/auth.js', 'public/js')
    .js('resources/js/user.js', 'public/js')
    .js('resources/js/admin.js', 'public/js')
    .react()
    .sass('resources/sass/app.scss', 'public/css');

mix.disableNotifications();

mix.browserSync({
    proxy: 'http://127.0.0.1:8000',
    files: [
        'resources/js/**/*.js', // Watch JS files
        'resources/sass/**/*.scss', // Watch SCSS files
        'resources/views/**/*.blade.php' // Watch Blade templates
    ],
    ignore: [
        '**/*.php' // Ignore changes in PHP files
    ]
});