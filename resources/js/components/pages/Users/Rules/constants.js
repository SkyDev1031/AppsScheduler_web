// constants.js

export const DAYS_OF_WEEK = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
];

export const METRIC_OPTIONS = [
    { label: 'Daily Usage (Minutes)', value: 'daily_usage_minutes' },
    { label: 'Launch Count', value: 'launch_count' },
    { label: 'Time of Day Usage', value: 'time_of_day' },
];

export const OPERATOR_OPTIONS = [
    { label: '>', value: '>' },
    { label: '<', value: '<' },
    { label: '>=', value: '>=' },
    { label: '<=', value: '<=' },
    { label: '=', value: '=' },
];

export const ACTION_TYPES = [
    { label: 'Block App', value: 'block' },
    { label: 'Limit Usage', value: 'limit' },
    { label: 'Send Notification', value: 'notify' },
];

export const EVALUATION_WINDOWS = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
];