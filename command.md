php artisan command:binary_payout
php artisan command:price
php artisan command:market_expire
php artisan command:package_expire
php artisan command:refresh_bitquery
php artisan command:swap_fees_payout

php artisan schedule:list
## run on local
php artisan schedule:work
## run on server
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1