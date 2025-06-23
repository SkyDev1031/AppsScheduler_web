<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DefaultAppsSeeder extends Seeder
{
    public function run()
    {
        // Get unique app entries by creating an associative array with app_name as key
        $uniqueApps = [];
        $apps = [
            // System / Essential Apps
            ['app_name' => 'Phone', 'app_package_name' => 'Phone'],
            ['app_name' => 'Contacts', 'app_package_name' => 'Contacts'],
            ['app_name' => 'Messages (AOSP)', 'app_package_name' => 'Messages (AOSP)'],
            ['app_name' => 'Clock', 'app_package_name' => 'Clock'],
            ['app_name' => 'Calculator', 'app_package_name' => 'Calculator'],
            ['app_name' => 'Camera', 'app_package_name' => 'Camera'],
            ['app_name' => 'Files', 'app_package_name' => 'Files'],
            ['app_name' => 'Settings', 'app_package_name' => 'Settings'],
            ['app_name' => 'Gallery', 'app_package_name' => 'Gallery'],
            
            // Google Apps
            ['app_name' => 'Google Play Store', 'app_package_name' => 'Google Play Store'],
            ['app_name' => 'Google Play Services', 'app_package_name' => 'Google Play Services'],
            ['app_name' => 'Google Assistant', 'app_package_name' => 'Google Assistant'],
            ['app_name' => 'Google App', 'app_package_name' => 'Google App'],
            ['app_name' => 'Pixel Launcher', 'app_package_name' => 'Pixel Launcher'],
            ['app_name' => 'Android System UI', 'app_package_name' => 'Android System UI'],
            ['app_name' => 'YouTube Music', 'app_package_name' => 'YouTube Music'],
            ['app_name' => 'Files by Google', 'app_package_name' => 'Files by Google'],
            ['app_name' => 'Google News', 'app_package_name' => 'Google News'],
            
            // Social Media
            ['app_name' => 'Facebook', 'app_package_name' => 'Facebook'],
            ['app_name' => 'Instagram', 'app_package_name' => 'Instagram'],
            ['app_name' => 'Snapchat', 'app_package_name' => 'Snapchat'],
            ['app_name' => 'TikTok', 'app_package_name' => 'TikTok'],
            ['app_name' => 'Twitter (X)', 'app_package_name' => 'Twitter (X)'],
            ['app_name' => 'LinkedIn', 'app_package_name' => 'LinkedIn'],
            
            // Messaging
            ['app_name' => 'WhatsApp', 'app_package_name' => 'WhatsApp'],
            ['app_name' => 'Telegram', 'app_package_name' => 'Telegram'],
            ['app_name' => 'Messenger', 'app_package_name' => 'Messenger'],
            ['app_name' => 'Signal', 'app_package_name' => 'Signal'],
            ['app_name' => 'Google Messages', 'app_package_name' => 'Google Messages'],
            ['app_name' => 'Viber', 'app_package_name' => 'Viber'],
            ['app_name' => 'WeChat', 'app_package_name' => 'WeChat'],
            ['app_name' => 'Line', 'app_package_name' => 'Line'],
            ['app_name' => 'KakaoTalk', 'app_package_name' => 'KakaoTalk'],
            
            // Entertainment
            ['app_name' => 'YouTube', 'app_package_name' => 'YouTube'],
            ['app_name' => 'Netflix', 'app_package_name' => 'Netflix'],
            ['app_name' => 'Spotify', 'app_package_name' => 'Spotify'],
            ['app_name' => 'Amazon Prime Video', 'app_package_name' => 'Amazon Prime Video'],
            ['app_name' => 'Disney+', 'app_package_name' => 'Disney+'],
            ['app_name' => 'Twitch', 'app_package_name' => 'Twitch'],
            
            // Browsers
            ['app_name' => 'Google Chrome', 'app_package_name' => 'Google Chrome'],
            ['app_name' => 'Firefox', 'app_package_name' => 'Firefox'],
            ['app_name' => 'Microsoft Edge', 'app_package_name' => 'Microsoft Edge'],
            ['app_name' => 'Brave', 'app_package_name' => 'Brave'],
            
            // Productivity
            ['app_name' => 'Gmail', 'app_package_name' => 'Gmail'],
            ['app_name' => 'Google Calendar', 'app_package_name' => 'Google Calendar'],
            ['app_name' => 'Google Drive', 'app_package_name' => 'Google Drive'],
            ['app_name' => 'Google Docs', 'app_package_name' => 'Google Docs'],
            ['app_name' => 'Microsoft Office', 'app_package_name' => 'Microsoft Office'],
            ['app_name' => 'Microsoft OneNote', 'app_package_name' => 'Microsoft OneNote'],
            ['app_name' => 'Notion', 'app_package_name' => 'Notion'],
            ['app_name' => 'Evernote', 'app_package_name' => 'Evernote'],
            ['app_name' => 'Todoist', 'app_package_name' => 'Todoist'],
            
            // Shopping & Payments
            ['app_name' => 'Amazon', 'app_package_name' => 'Amazon'],
            ['app_name' => 'eBay', 'app_package_name' => 'eBay'],
            ['app_name' => 'AliExpress', 'app_package_name' => 'AliExpress'],
            ['app_name' => 'Walmart', 'app_package_name' => 'Walmart'],
            ['app_name' => 'Flipkart', 'app_package_name' => 'Flipkart'],
            ['app_name' => 'PayPal', 'app_package_name' => 'PayPal'],
            ['app_name' => 'Google Pay', 'app_package_name' => 'Google Pay'],
            ['app_name' => 'Venmo', 'app_package_name' => 'Venmo'],
            ['app_name' => 'Cash App', 'app_package_name' => 'Cash App'],
            
            // Travel & Education
            ['app_name' => 'Google Maps', 'app_package_name' => 'Google Maps'],
            ['app_name' => 'Uber', 'app_package_name' => 'Uber'],
            ['app_name' => 'Airbnb', 'app_package_name' => 'Airbnb'],
            ['app_name' => 'Duolingo', 'app_package_name' => 'Duolingo'],
            ['app_name' => 'Khan Academy', 'app_package_name' => 'Khan Academy'],
            
            // Business & Communication
            ['app_name' => 'Slack', 'app_package_name' => 'Slack'],
            ['app_name' => 'Discord', 'app_package_name' => 'Discord'],
            ['app_name' => 'Microsoft Teams', 'app_package_name' => 'Microsoft Teams'],
            ['app_name' => 'Zoom', 'app_package_name' => 'Zoom'],
            ['app_name' => 'Skype', 'app_package_name' => 'Skype'],
            ['app_name' => 'Google Meet', 'app_package_name' => 'Google Meet'],
            ['app_name' => 'Webex', 'app_package_name' => 'Webex'],
            ['app_name' => 'GoToMeeting', 'app_package_name' => 'GoToMeeting'],
            ['app_name' => 'BlueJeans', 'app_package_name' => 'BlueJeans'],
            ['app_name' => 'Jitsi Meet', 'app_package_name' => 'Jitsi Meet'],
            
            // Development Tools
            ['app_name' => 'Unity', 'app_package_name' => 'Unity'],
            ['app_name' => 'Unreal Engine', 'app_package_name' => 'Unreal Engine'],
            ['app_name' => 'Flutter', 'app_package_name' => 'Flutter'],
            ['app_name' => 'React Native', 'app_package_name' => 'React Native'],
            ['app_name' => 'Xamarin', 'app_package_name' => 'Xamarin'],
            
            // Design Tools
            ['app_name' => 'Adobe XD', 'app_package_name' => 'Adobe XD'],
            ['app_name' => 'Figma', 'app_package_name' => 'Figma'],
            ['app_name' => 'Sketch', 'app_package_name' => 'Sketch'],
            ['app_name' => 'Canva', 'app_package_name' => 'Canva'],
            
            // Project Management
            ['app_name' => 'Trello', 'app_package_name' => 'Trello'],
            ['app_name' => 'Asana', 'app_package_name' => 'Asana'],
            ['app_name' => 'Monday.com', 'app_package_name' => 'Monday.com'],
            ['app_name' => 'ClickUp', 'app_package_name' => 'ClickUp'],
            
            // Note Taking
            ['app_name' => 'Google Keep', 'app_package_name' => 'Google Keep'],
            ['app_name' => 'Apple Notes', 'app_package_name' => 'Apple Notes'],
            ['app_name' => 'Bear', 'app_package_name' => 'Bear'],
            ['app_name' => 'Simplenote', 'app_package_name' => 'Simplenote'],
        ];

        // Remove duplicates by using app_name as key
        foreach ($apps as $app) {
            $uniqueApps[$app['app_name']] = $app;
        }

        // Insert unique apps into the database
        DB::table('default_apps')->insert(array_values($uniqueApps));
    }
}
