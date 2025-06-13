<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Apps Scheduler</title>
    <meta name="description" content="Analysis App Usage Duration and Frequency">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

    <link rel="preload" as="image" href="<?php echo e(asset('assets/preloader.gif')); ?>">
    <link rel="preload" as="script" href="<?php echo e(asset('js/auth.js')); ?>">
    <link rel="preload" as="script" href="<?php echo e(asset('assets/home/js/jquery-ui.min.js')); ?>">
    <link rel="preload" as="style" href="<?php echo e(asset('assets/home/css/bootstrap.min.css')); ?>">
    <link rel="preload" as="script" href="<?php echo e(asset('assets/home/js/jquery.min.js')); ?>">
    <link rel="preload" as="script" href="<?php echo e(asset('assets/home/js/fontawesome.js')); ?>">
    <link rel="preload" as="style" href="<?php echo e(asset('assets/home/css/style.css')); ?>">
    <link rel="preload" as="script" href="<?php echo e(asset('assets/home/js/bootstrap.min.js')); ?>">

    <link rel="stylesheet" href="<?php echo e(asset('assets/home/css/bootstrap.min.css')); ?>">
    <link rel="stylesheet" href="<?php echo e(asset('assets/home/css/fontawesome.min.css')); ?>">
    <link rel="stylesheet" href="<?php echo e(asset('assets/home/css/jquery-ui.css')); ?>">
    <link rel="stylesheet" href="<?php echo e(asset('assets/home/css/plugin/nice-select.css')); ?>">
    <link rel="stylesheet" href="<?php echo e(asset('assets/home/css/plugin/magnific-popup.css')); ?>">
    <link rel="stylesheet" href="<?php echo e(asset('assets/home/css/plugin/slick.css')); ?>">
    <link rel="stylesheet" href="<?php echo e(asset('assets/home/css/arafat-font.css')); ?>">
    <link rel="stylesheet" href="<?php echo e(asset('assets/home/css/plugin/animate.css')); ?>">
    <link rel="stylesheet" href="<?php echo e(asset('assets/home/css/style.css')); ?>">
    <script src="<?php echo e(asset('assets/home/js/jquery.min.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/home/js/jquery-ui.min.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/home/js/bootstrap.min.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/home/js/fontawesome.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/home/js/plugin/slick.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/home/js/plugin/jquery.nice-select.min.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/home/js/plugin/counter.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/home/js/plugin/waypoint.min.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/home/js/plugin/jquery.magnific-popup.min.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/home/js/plugin/wow.min.js')); ?>"></script>
    <script src="<?php echo e(asset('assets/home/js/plugin/plugin.js')); ?>"></script>
    <script defer src="<?php echo e(asset('assets/home/js/main.js')); ?>"></script>
    <script defer src="<?php echo e(asset('js/auth.js')); ?>"></script>
</head>

<body>
    <div class="preloader" id="preloader"></div>
    <a href="javascript:void(0)" class="scrollToTop"><i class="fas fa-angle-double-up"></i></a>
    <div id="app"></div>
</body>

</html><?php /**PATH /var/www/vhosts/appsscheduler.com/httpdocs/resources/views/dashboard.blade.php ENDPATH**/ ?>