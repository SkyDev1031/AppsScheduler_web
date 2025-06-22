<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DefaultAppsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('default_apps')->insert([
            // System / Essential Apps
            ['app_name' => 'Phone', 'app_package_name' => 'com.android.dialer'],
            ['app_name' => 'Contacts', 'app_package_name' => 'com.android.contacts'],
            ['app_name' => 'Messages (AOSP)', 'app_package_name' => 'com.android.messaging'],
            ['app_name' => 'Clock', 'app_package_name' => 'com.google.android.deskclock'],
            ['app_name' => 'Calculator', 'app_package_name' => 'com.google.android.calculator'],
            ['app_name' => 'Camera', 'app_package_name' => 'com.google.android.GoogleCamera'],
            ['app_name' => 'Files', 'app_package_name' => 'com.google.android.apps.nbu.files'],
            ['app_name' => 'Settings', 'app_package_name' => 'com.android.settings'],
            ['app_name' => 'Gallery', 'app_package_name' => 'com.google.android.apps.photos'],

            // Play Services and Store
            ['app_name' => 'Google Play Store', 'app_package_name' => 'com.android.vending'],
            ['app_name' => 'Google Play Services', 'app_package_name' => 'com.google.android.gms'],

            // Voice Assistant & Launcher
            ['app_name' => 'Google Assistant', 'app_package_name' => 'com.google.android.apps.googleassistant'],
            ['app_name' => 'Google App', 'app_package_name' => 'com.google.android.googlequicksearchbox'],
            ['app_name' => 'Pixel Launcher', 'app_package_name' => 'com.google.android.apps.nexuslauncher'],

            // System UI (for system overlays or screens)
            ['app_name' => 'Android System UI', 'app_package_name' => 'com.android.systemui'],

            // Others (used by OEMs or often preinstalled)
            ['app_name' => 'YouTube Music', 'app_package_name' => 'com.google.android.apps.youtube.music'],
            ['app_name' => 'Files by Google', 'app_package_name' => 'com.google.android.apps.nbu.files'],
            ['app_name' => 'Google News', 'app_package_name' => 'com.google.android.apps.magazines'],
            // Social Media
            ['app_name' => 'Facebook', 'app_package_name' => 'com.facebook.katana'],
            ['app_name' => 'Instagram', 'app_package_name' => 'com.instagram.android'],
            ['app_name' => 'Snapchat', 'app_package_name' => 'com.snapchat.android'],
            ['app_name' => 'TikTok', 'app_package_name' => 'com.zhiliaoapp.musically'],
            ['app_name' => 'Twitter (X)', 'app_package_name' => 'com.twitter.android'],
            ['app_name' => 'LinkedIn', 'app_package_name' => 'com.linkedin.android'],

            // Messaging
            ['app_name' => 'WhatsApp', 'app_package_name' => 'com.whatsapp'],
            ['app_name' => 'Telegram', 'app_package_name' => 'org.telegram.messenger'],
            ['app_name' => 'Messenger', 'app_package_name' => 'com.facebook.orca'],
            ['app_name' => 'Signal', 'app_package_name' => 'org.thoughtcrime.securesms'],
            ['app_name' => 'Google Messages', 'app_package_name' => 'com.google.android.apps.messaging'],

            // Entertainment
            ['app_name' => 'YouTube', 'app_package_name' => 'com.google.android.youtube'],
            ['app_name' => 'Netflix', 'app_package_name' => 'com.netflix.mediaclient'],
            ['app_name' => 'Spotify', 'app_package_name' => 'com.spotify.music'],
            ['app_name' => 'Amazon Prime Video', 'app_package_name' => 'com.amazon.avod.thirdpartyclient'],
            ['app_name' => 'Disney+', 'app_package_name' => 'com.disney.disneyplus'],

            // Browsers
            ['app_name' => 'Google Chrome', 'app_package_name' => 'com.android.chrome'],
            ['app_name' => 'Firefox', 'app_package_name' => 'org.mozilla.firefox'],
            ['app_name' => 'Microsoft Edge', 'app_package_name' => 'com.microsoft.emmx'],
            ['app_name' => 'Brave', 'app_package_name' => 'com.brave.browser'],

            // Productivity
            ['app_name' => 'Gmail', 'app_package_name' => 'com.google.android.gm'],
            ['app_name' => 'Google Calendar', 'app_package_name' => 'com.google.android.calendar'],
            ['app_name' => 'Google Drive', 'app_package_name' => 'com.google.android.apps.docs'],
            ['app_name' => 'Google Docs', 'app_package_name' => 'com.google.android.apps.docs.editors.docs'],
            ['app_name' => 'Notion', 'app_package_name' => 'notion.id'],
            ['app_name' => 'Evernote', 'app_package_name' => 'com.evernote'],

            // Shopping
            ['app_name' => 'Amazon', 'app_package_name' => 'com.amazon.mShop.android.shopping'],
            ['app_name' => 'eBay', 'app_package_name' => 'com.ebay.mobile'],
            ['app_name' => 'AliExpress', 'app_package_name' => 'com.alibaba.aliexpresshd'],
            ['app_name' => 'Walmart', 'app_package_name' => 'com.walmart.android'],
            ['app_name' => 'Flipkart', 'app_package_name' => 'com.flipkart.android'],

            // Finance
            ['app_name' => 'PayPal', 'app_package_name' => 'com.paypal.android.p2pmobile'],
            ['app_name' => 'Google Pay', 'app_package_name' => 'com.google.android.apps.nbu.paisa.user'],
            ['app_name' => 'Venmo', 'app_package_name' => 'com.venmo'],
            ['app_name' => 'Cash App', 'app_package_name' => 'com.squareup.cash'],

            // Miscellaneous
            ['app_name' => 'Google Maps', 'app_package_name' => 'com.google.android.apps.maps'],
            ['app_name' => 'Uber', 'app_package_name' => 'com.ubercab'],
            ['app_name' => 'Airbnb', 'app_package_name' => 'com.airbnb.android'],
            ['app_name' => 'Duolingo', 'app_package_name' => 'com.duolingo'],
        ]);
    }
}
