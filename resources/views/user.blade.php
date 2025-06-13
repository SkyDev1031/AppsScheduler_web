<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Apps Scheduler</title>
    <meta name="description"
        content="Analysis App Usage Duration and Frequency">
    <link rel="preload" as="image" href="{{asset('assets/preloader.gif')}}">
    <link rel="preload" as="script" href="{{asset('js/user.js')}}">
    <link rel="preload" as="script" href="{{asset('assets/user/js/jquery-ui.min.js')}}">
    <link rel="preload" as="style" href="{{asset('assets/user/css/bootstrap.min.css')}}">
    <link rel="preload" as="script" href="{{asset('assets/user/js/jquery.min.js')}}">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

    <link rel="preload" as="style" href="{{asset('assets/user/css/style.css')}}">
    <link rel="preload" as="script" href="{{asset('assets/user/js/bootstrap.min.js')}}">

    <link rel="stylesheet" href="{{asset('assets/user/css/bootstrap.min.css')}}">
    <link rel="stylesheet" href="{{asset('assets/user/css/fontawesome.min.css')}}">
    <link rel="stylesheet" href="{{asset('assets/user/css/jquery-ui.css')}}">
    <link rel="stylesheet" href="{{asset('assets/user/css/plugin/apexcharts.css')}}">
    <link rel="stylesheet" href="{{asset('assets/user/css/plugin/nice-select.css')}}">
    <link rel="stylesheet" href="{{asset('assets/user/css/arafat-font.css')}}">
    <link rel="stylesheet" href="{{asset('assets/user/css/plugin/animate.css')}}">
    <link rel="stylesheet" href="{{asset('assets/user/css/style.css')}}">
    <link rel="stylesheet" href="{{asset('assets/user/jquery-horizontal-tree/style.css')}}">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">

    <script src="{{asset('assets/user/js/jquery.min.js')}}"></script>
    <script src="{{asset('assets/user/js/bootstrap.min.js')}}"></script>
    <script src="{{asset('assets/user/js/jquery-ui.min.js')}}"></script>
    <script src="{{asset('assets/user/js/plugin/apexcharts.js')}}"></script>
    <script src="{{asset('assets/user/js/plugin/jquery.nice-select.min.js')}}"></script>
    <script src="{{asset('assets/user/js/plugin/waypoint.min.js')}}"></script>
    <script src="{{asset('assets/user/js/plugin/wow.min.js')}}"></script>
    <script src="{{asset('assets/user/js/plugin/plugin.js')}}"></script>
    <script src="{{asset('assets/user/jquery-horizontal-tree/js/jquery.tree.js')}}"></script>
    <script defer src="{{asset('assets/user/js/main.js')}}"></script>

    <script defer src="{{asset('js/user.js')}}"></script>
</head>

<body>
    <div class="preloader" id="preloader"></div>
    <a href="javascript:void(0)" class="scrollToTop"><i class="fas fa-angle-double-up"></i></a>
    <div id="app"></div>
</body>

</html>