<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DefaultAppsSeeder extends Seeder
{
    public function run()
    {
        $apps = [
            // System / Essential Apps
            ['app_name' => 'Phone', 'app_package_name' => 'com.android.dialer', 'aliases' => ['Dialer']],
            ['app_name' => 'Contacts', 'app_package_name' => 'com.android.contacts', 'aliases' => []],
            ['app_name' => 'Messages (AOSP)', 'app_package_name' => 'com.android.messaging', 'aliases' => ['Messages']],
            ['app_name' => 'Clock', 'app_package_name' => 'com.google.android.deskclock', 'aliases' => []],
            ['app_name' => 'Calculator', 'app_package_name' => 'com.android.calculator2', 'aliases' => []],
            ['app_name' => 'Camera', 'app_package_name' => 'com.android.camera', 'aliases' => []],
            ['app_name' => 'Files', 'app_package_name' => 'com.android.documentsui', 'aliases' => []],
            ['app_name' => 'Settings', 'app_package_name' => 'com.android.settings', 'aliases' => []],
            ['app_name' => 'Gallery', 'app_package_name' => 'com.google.android.apps.photos', 'aliases' => ['Photos']],

            // Google Apps
            ['app_name' => 'Google Play Store', 'app_package_name' => 'com.android.vending', 'aliases' => ['Play Store']],
            ['app_name' => 'Google Play Services', 'app_package_name' => 'com.google.android.gms', 'aliases' => ['Play Services']],
            ['app_name' => 'Google Assistant', 'app_package_name' => 'com.google.android.googlequicksearchbox', 'aliases' => ['Assistant']],
            ['app_name' => 'Google App', 'app_package_name' => 'com.google.android.googlequicksearchbox', 'aliases' => ['Google']],
            ['app_name' => 'Pixel Launcher', 'app_package_name' => 'com.google.android.apps.nexuslauncher', 'aliases' => ['Launcher']],
            ['app_name' => 'Android System UI', 'app_package_name' => 'com.android.systemui', 'aliases' => ['System UI']],
            ['app_name' => 'YouTube Music', 'app_package_name' => 'com.google.android.apps.youtube.music', 'aliases' => ['YT Music']],
            ['app_name' => 'Files by Google', 'app_package_name' => 'com.google.android.apps.nbu.files', 'aliases' => ['Files']],
            ['app_name' => 'Google News', 'app_package_name' => 'com.google.android.apps.magazines', 'aliases' => ['News']],

            // Social Media
            ['app_name' => 'Facebook', 'app_package_name' => 'com.facebook.katana', 'aliases' => []],
            ['app_name' => 'Instagram', 'app_package_name' => 'com.instagram.android', 'aliases' => []],
            ['app_name' => 'Snapchat', 'app_package_name' => 'com.snapchat.android', 'aliases' => []],
            ['app_name' => 'TikTok', 'app_package_name' => 'com.zhiliaoapp.musically', 'aliases' => []],
            ['app_name' => 'Twitter (X)', 'app_package_name' => 'com.twitter.android', 'aliases' => ['Twitter', 'X']],
            ['app_name' => 'LinkedIn', 'app_package_name' => 'com.linkedin.android', 'aliases' => []],

            // Messaging
            ['app_name' => 'WhatsApp', 'app_package_name' => 'com.whatsapp', 'aliases' => []],
            ['app_name' => 'Telegram', 'app_package_name' => 'org.telegram.messenger', 'aliases' => []],
            ['app_name' => 'Messenger', 'app_package_name' => 'com.facebook.orca', 'aliases' => []],
            ['app_name' => 'Signal', 'app_package_name' => 'org.thoughtcrime.securesms', 'aliases' => []],
            ['app_name' => 'Google Messages', 'app_package_name' => 'com.google.android.apps.messaging', 'aliases' => ['Messages']],
            ['app_name' => 'Viber', 'app_package_name' => 'com.viber.voip', 'aliases' => []],
            ['app_name' => 'WeChat', 'app_package_name' => 'com.tencent.mm', 'aliases' => []],
            ['app_name' => 'Line', 'app_package_name' => 'jp.naver.line.android', 'aliases' => []],
            ['app_name' => 'KakaoTalk', 'app_package_name' => 'com.kakao.talk', 'aliases' => []],

            // Entertainment
            ['app_name' => 'YouTube', 'app_package_name' => 'com.google.android.youtube', 'aliases' => []],
            ['app_name' => 'Netflix', 'app_package_name' => 'com.netflix.mediaclient', 'aliases' => []],
            ['app_name' => 'Spotify', 'app_package_name' => 'com.spotify.music', 'aliases' => []],
            ['app_name' => 'Amazon Prime Video', 'app_package_name' => 'com.amazon.avod.thirdpartyclient', 'aliases' => ['Prime Video']],
            ['app_name' => 'Disney+', 'app_package_name' => 'com.disney.disneyplus', 'aliases' => ['Disney Plus']],
            ['app_name' => 'Twitch', 'app_package_name' => 'tv.twitch.android.app', 'aliases' => []],

            // Browsers
            ['app_name' => 'Google Chrome', 'app_package_name' => 'com.android.chrome', 'aliases' => ['Chrome']],
            ['app_name' => 'Firefox', 'app_package_name' => 'org.mozilla.firefox', 'aliases' => []],
            ['app_name' => 'Microsoft Edge', 'app_package_name' => 'com.microsoft.emmx', 'aliases' => ['Edge']],
            ['app_name' => 'Brave', 'app_package_name' => 'com.brave.browser', 'aliases' => []],

            // Productivity
            ['app_name' => 'Gmail', 'app_package_name' => 'com.google.android.gm', 'aliases' => []],
            ['app_name' => 'Google Calendar', 'app_package_name' => 'com.google.android.calendar', 'aliases' => ['Calendar']],
            ['app_name' => 'Google Drive', 'app_package_name' => 'com.google.android.apps.docs', 'aliases' => ['Drive']],
            ['app_name' => 'Google Docs', 'app_package_name' => 'com.google.android.apps.docs.editors.docs', 'aliases' => ['Docs']],
            ['app_name' => 'Microsoft Office', 'app_package_name' => 'com.microsoft.office.officehubrow', 'aliases' => ['Office']],
            ['app_name' => 'Microsoft OneNote', 'app_package_name' => 'com.microsoft.office.onenote', 'aliases' => ['OneNote']],
            ['app_name' => 'Notion', 'app_package_name' => 'notion.id', 'aliases' => []],
            ['app_name' => 'Evernote', 'app_package_name' => 'com.evernote', 'aliases' => []],
            ['app_name' => 'Todoist', 'app_package_name' => 'com.todoist', 'aliases' => []],

            // Shopping & Payments
            ['app_name' => 'Amazon', 'app_package_name' => 'com.amazon.mShop.android.shopping', 'aliases' => []],
            ['app_name' => 'eBay', 'app_package_name' => 'com.ebay.mobile', 'aliases' => []],
            ['app_name' => 'AliExpress', 'app_package_name' => 'com.alibaba.aliexpresshd', 'aliases' => []],
            ['app_name' => 'Walmart', 'app_package_name' => 'com.walmart.android', 'aliases' => []],
            ['app_name' => 'Flipkart', 'app_package_name' => 'com.flipkart.android', 'aliases' => []],
            ['app_name' => 'PayPal', 'app_package_name' => 'com.paypal.android.p2pmobile', 'aliases' => []],
            ['app_name' => 'Google Pay', 'app_package_name' => 'com.google.android.apps.nbu.paisa.user', 'aliases' => ['GPay']],
            ['app_name' => 'Venmo', 'app_package_name' => 'com.venmo', 'aliases' => []],
            ['app_name' => 'Cash App', 'app_package_name' => 'com.squareup.cash', 'aliases' => []],

            // Travel & Education
            ['app_name' => 'Google Maps', 'app_package_name' => 'com.google.android.apps.maps', 'aliases' => ['Maps']],
            ['app_name' => 'Uber', 'app_package_name' => 'com.ubercab', 'aliases' => []],
            ['app_name' => 'Airbnb', 'app_package_name' => 'com.airbnb.android', 'aliases' => []],
            ['app_name' => 'Duolingo', 'app_package_name' => 'com.duolingo', 'aliases' => []],
            ['app_name' => 'Khan Academy', 'app_package_name' => 'org.khanacademy.android', 'aliases' => []],

            // Business & Communication
            ['app_name' => 'Slack', 'app_package_name' => 'com.Slack', 'aliases' => []],
            ['app_name' => 'Discord', 'app_package_name' => 'com.discord', 'aliases' => []],
            ['app_name' => 'Microsoft Teams', 'app_package_name' => 'com.microsoft.teams', 'aliases' => ['Teams']],
            ['app_name' => 'Zoom', 'app_package_name' => 'us.zoom.videomeetings', 'aliases' => []],
            ['app_name' => 'Skype', 'app_package_name' => 'com.skype.raider', 'aliases' => []],
            ['app_name' => 'Google Meet', 'app_package_name' => 'com.google.android.apps.meetings', 'aliases' => ['Meet']],
            ['app_name' => 'Webex', 'app_package_name' => 'com.cisco.webex.meetings', 'aliases' => []],
            ['app_name' => 'GoToMeeting', 'app_package_name' => 'com.logmein.gotomeeting', 'aliases' => []],
            ['app_name' => 'BlueJeans', 'app_package_name' => 'com.bluejeansnet.Base', 'aliases' => []],
            ['app_name' => 'Jitsi Meet', 'app_package_name' => 'org.jitsi.meet', 'aliases' => []],

            // Development Tools
            ['app_name' => 'Unity', 'app_package_name' => 'com.unity3d.unityhub', 'aliases' => []],
            ['app_name' => 'Unreal Engine', 'app_package_name' => 'com.epicgames.ue4', 'aliases' => []],
            ['app_name' => 'Flutter', 'app_package_name' => 'io.flutter.devtools', 'aliases' => []],
            ['app_name' => 'React Native', 'app_package_name' => 'org.reactjs.native', 'aliases' => []],
            ['app_name' => 'Xamarin', 'app_package_name' => 'com.xamarin.inspector', 'aliases' => []],

            // Design Tools
            ['app_name' => 'Adobe XD', 'app_package_name' => 'com.adobe.spark.post', 'aliases' => []],
            ['app_name' => 'Figma', 'app_package_name' => 'com.figma.mirror', 'aliases' => []],
            ['app_name' => 'Sketch', 'app_package_name' => 'com.bohemiancoding.sketch', 'aliases' => []],
            ['app_name' => 'Canva', 'app_package_name' => 'com.canva.editor', 'aliases' => []],

            // Project Management
            ['app_name' => 'Trello', 'app_package_name' => 'com.trello', 'aliases' => []],
            ['app_name' => 'Asana', 'app_package_name' => 'com.asana.app', 'aliases' => []],
            ['app_name' => 'Monday.com', 'app_package_name' => 'com.monday.monday', 'aliases' => ['Monday']],
            ['app_name' => 'ClickUp', 'app_package_name' => 'com.clickup.android', 'aliases' => []],

            // Note Taking
            ['app_name' => 'Google Keep', 'app_package_name' => 'com.google.android.keep', 'aliases' => ['Keep']],
            ['app_name' => 'Apple Notes', 'app_package_name' => 'com.apple.Notes', 'aliases' => ['Notes']],
            ['app_name' => 'Bear', 'app_package_name' => 'net.shinyfrog.bear', 'aliases' => []],
            ['app_name' => 'Simplenote', 'app_package_name' => 'com.automattic.simplenote', 'aliases' => []],
        ];

        $flattenedApps = [];

        foreach ($apps as $app) {
            // Insert main entry
            $flattenedApps[$app['app_name']] = [
                'app_name' => $app['app_name'],
                'app_package_name' => $app['app_package_name']
            ];

            // Insert alias entries
            foreach ($app['aliases'] ?? [] as $alias) {
                $flattenedApps[$alias] = [
                    'app_name' => $alias,
                    'app_package_name' => $app['app_package_name']
                ];
            }
        }

        DB::table('default_apps')->insert(array_values($flattenedApps));
    }
}
