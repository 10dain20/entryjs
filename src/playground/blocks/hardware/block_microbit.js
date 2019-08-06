'use strict';

const _clamp = require('lodash/clamp');
const _get = require('lodash/get');

const functionKeys = {
    TEST_MESSAGE: 0xfa,
    RESET: 0xfe,
    CHECK_READY: 0xff,
    SET_LED: 0x01,
    SET_STRING: 0x02,
    SET_IMAGE: 0x03,
    SET_DIGITAL: 0x07,
    SET_ANALOG: 0x08,
    RESET_SCREEN: 0x09,
    SET_ANALOG_PERIOD: 0x10,
    SET_SERVO: 0x11,
    SET_SERVO_PERIOD: 0x12,
    GET_LED: 0x31,
    GET_ANALOG: 0x32,
    GET_DIGITAL: 0x33,
    GET_BUTTON: 0x34,
    GET_LIGHT_LEVEL: 0x35,
    GET_TEMPERATURE: 0x36,
    GET_COMPASS_HEADING: 0x37,
    GET_ACCELEROMETER: 0x38,

    // PLAY_NOTE: 0x04,
    // CHANGE_BPM: 0x05,
    // SET_BPM: 0x06,
};

Entry.Microbit = new class Microbit {
    constructor() {
        this.id = 'FF.1';
        this.url = 'http://microbit.org/ko/';
        this.imageName = 'microbit.png';
        this.title = {
            en: 'Microbit',
            ko: '마이크로빗',
        };
        this.name = 'microbit';
        this.communicationType = 'manual';
        this.blockMenuBlocks = [
            'microbit_led_toggle',
            'microbit_get_led',
            'microbit_show_string',
            'microbit_show_image',
            'microbit_reset_screen',
            'microbit_set_analog',
            'microbit_set_analog_period',
            'microbit_get_analog',
            'microbit_get_analog_map',
            'microbit_set_digital',
            'microbit_get_digital',
            'microbit_get_button',
            'microbit_get_sensor',
            'microbit_get_accelerometer',
            'microbit_set_servo',
            'microbit_set_servo_period',
        ];
    }

    getHashKey() {
        let key = new Date().getSeconds().toString(16);
        if (key.length === 1) {
            key += ((Math.random() * 16) | 0).toString(16);
        }
        return Entry.generateHash(2) + key;
    }

    setZero() {
        this.requestCommand(functionKeys.RESET);
        delete Entry.hw.portData.sensorData;
    }

    requestCommand(type, payload) {
        Entry.hw.sendQueue = {
            id: this.getHashKey(),
            type,
            payload,
        };
        Entry.hw.update();
    }

    /**
     * command 요청 후 데이터 송수신이 끝날 때까지 대기한다.
     * @param type
     * @param payload
     */
    requestCommandWithResponse(type, payload) {
        if (!Entry.hw.pending && !this.isCommandRequested) {
            // 첫 진입시 무조건 AsyncError
            this.isCommandRequested = true;
            Entry.hw.sendQueue = {
                id: this.getHashKey(),
                type,
                payload,
            };
            Entry.hw.update();
            throw new Entry.Utils.AsyncError();
        } else if (Entry.hw.pending && this.isCommandRequested) {
            // 두 번째 이상의 진입시도이며 작업이 아직 끝나지 않은 경우
            throw new Entry.Utils.AsyncError();
        } else {
            // 두 번째 이상의 진입시도이며 pending 도 아닌 경우
            // 블록 func 로직에서 다음 데이터를 처리한다.
            delete this.isCommandRequested;
        }
    }

    getBlocks() {
        return {
            microbit_led_toggle: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: 'LED의 X:%1 Y:%2 %3 %4',
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Dropdown',
                        options: [['켜기', 'on'], ['끄기', 'off'], ['반전', 'toggle']],
                        value: 'on',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitLed',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['0'],
                        },
                        {
                            type: 'text',
                            params: ['0'],
                        },
                    ],
                    type: 'microbit_led_toggle',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                    VALUE: 2,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    const x = _clamp(script.getNumberValue('X'), 0, 4);
                    const y = _clamp(script.getNumberValue('Y'), 0, 4);
                    this.requestCommand(functionKeys.SET_LED, { x, y, value });
                },
            },
            microbit_get_led: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: 'LED의 X:%1 Y:%2 상태값',
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                events: {},
                class: 'microbitLed',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['0'],
                        },
                        {
                            type: 'text',
                            params: ['0'],
                        },
                    ],
                    type: 'microbit_get_led',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                },
                func: (sprite, script) => {
                    const x = _clamp(script.getNumberValue('X'), 0, 4);
                    const y = _clamp(script.getNumberValue('Y'), 0, 4);
                    this.requestCommandWithResponse(functionKeys.GET_LED, { x, y });
                    return _get(Entry.hw.portData, ['payload', 'sensorData', 'led', x, y], 0);
                },
            },
            microbit_show_string: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 출력하기 %2',
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitLed',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['Hello!'],
                        },
                    ],
                    type: 'microbit_show_string',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    let value = script.getStringValue('VALUE');
                    value = value.replace(
                        /[^A-Za-z0-9_\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\\\{\}\[\]\'\"\;\:\<\,\>\.\?\/\s]/gim,
                        ''
                    );
                    this.requestCommand(functionKeys.SET_STRING, value);
                },
            },
            microbit_show_image: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 아이콘 출력하기 %2',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['하트', 0],
                            ['행복함', 2],
                            ['삼각형', 13],
                            ['사각형', 19],
                            ['다이아몬드', 17],
                        ],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitLed',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_show_image',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommand(functionKeys.SET_IMAGE, { value });
                },
            },
            microbit_reset_screen: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '화면 지우기 %1',
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitLed',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_reset_screen',
                },
                paramsKeyMap: {},
                func: (sprite, script) => {
                    this.requestCommand(functionKeys.RESET_SCREEN);
                },
            },
            microbit_set_analog: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 에 아날로그 값 %2 출력 %3',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitAnalog',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['1023'],
                        },
                    ],
                    type: 'microbit_set_analog',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = _clamp(script.getNumberValue('VALUE'), 0, 1023);
                    this.requestCommand(functionKeys.SET_ANALOG, { pinNumber, value });
                },
            },
            microbit_set_analog_period: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 에 아날로그 PWM 출력 주기를 %2 (µs) 로 설정 %3',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitAnalog',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['20000'],
                        },
                    ],
                    type: 'microbit_set_analog_period',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = script.getNumberValue('VALUE');
                    this.requestCommand(functionKeys.SET_ANALOG_PERIOD, { pinNumber, value });
                },
            },
            microbit_get_analog: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: '아날로그 핀 %1번 센서값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitAnalog',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_get_analog',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(functionKeys.GET_ANALOG, [value]);
                    return _get(Entry.hw.portData, ['payload', 'sensorData', 'analog', value], 0);
                },
            },
            microbit_get_analog_map: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: '아날로그 핀 %1번 센서값의 범위를 %2~%3 에서 %4~%5 (으)로 바꾼값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                events: {},
                class: 'microbitAnalog',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        {
                            type: 'number',
                            params: ['1023'],
                        },
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        {
                            type: 'number',
                            params: ['100'],
                        },
                    ],
                    type: 'microbit_get_analog_map',
                },
                paramsKeyMap: {
                    PORT: 0,
                    VALUE2: 1,
                    VALUE3: 2,
                    VALUE4: 3,
                    VALUE5: 4,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(functionKeys.GET_ANALOG, [value]);
                    let returnData = _get(
                        Entry.hw.portData,
                        ['payload', 'sensorData', 'analog', value],
                        0
                    );

                    let value2 = script.getNumberValue('VALUE2', script);
                    let value3 = script.getNumberValue('VALUE3', script);
                    let value4 = script.getNumberValue('VALUE4', script);
                    let value5 = script.getNumberValue('VALUE5', script);
                    const stringValue4 = script.getValue('VALUE4', script);
                    const stringValue5 = script.getValue('VALUE5', script);
                    let isFloat = false;

                    if (
                        (Entry.Utils.isNumber(stringValue4) && stringValue4.indexOf('.') > -1) ||
                        (Entry.Utils.isNumber(stringValue5) && stringValue5.indexOf('.') > -1)
                    ) {
                        isFloat = true;
                    }
                    let swap;
                    if (value2 > value3) {
                        swap = value2;
                        value2 = value3;
                        value3 = swap;
                    }
                    if (value4 > value5) {
                        swap = value4;
                        value4 = value5;
                        value5 = swap;
                    }
                    returnData -= value2;
                    returnData = returnData * ((value5 - value4) / (value3 - value2));
                    returnData += value4;
                    returnData = Math.min(value5, returnData);
                    returnData = Math.max(value4, returnData);

                    if (isFloat) {
                        returnData = Math.round(returnData * 100) / 100;
                    } else {
                        returnData = Math.round(returnData);
                    }
                    return returnData;
                },
            },
            microbit_set_digital: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 에 디지털 값 %2 출력 %3',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [['0', 0], ['1', 1]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitDigital',
                isNotFor: ['microbit'],
                def: {
                    params: [],
                    type: 'microbit_set_digital',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = script.getNumberField('VALUE');
                    this.requestCommand(functionKeys.SET_DIGITAL, { pinNumber, value });
                },
            },
            microbit_get_digital: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                template: '디지털 핀 %1번 센서값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitDigital',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_get_digital',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(functionKeys.GET_DIGITAL, [value]);
                    return _get(Entry.hw.portData, ['payload', 'sensorData', 'digital', value], 0);
                },
            },
            microbit_get_button: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                template: '%1버튼을 눌렀는가?',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['A', 1], ['B', 2], ['A+B', 3]],
                        value: 1,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitButton',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_get_button',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(functionKeys.GET_BUTTON);
                    const buttonState = _get(
                        Entry.hw.portData,
                        ['payload', 'sensorData', 'button'],
                        -1
                    );

                    // double equal 은 의도한 것임.
                    return buttonState == value;
                },
            },
            microbit_get_sensor: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: '%1 센서값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['빛', 'lightLevel'],
                            ['온도', 'temperature'],
                            ['자기', 'compassHeading'],
                        ],
                        value: 'temperature',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitSensor',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_get_sensor',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    let commandType;
                    switch (value) {
                        case 'lightLevel':
                            commandType = functionKeys.GET_LIGHT_LEVEL;
                            break;
                        case 'temperature':
                            commandType = functionKeys.GET_TEMPERATURE;
                            break;
                        case 'compassHeading':
                            commandType = functionKeys.GET_COMPASS_HEADING;
                            break;
                        default:
                            // 입력값이 정상적이지 않은 경우 온도값을 표기
                            commandType = functionKeys.GET_TEMPERATURE;
                            break;
                    }
                    this.requestCommandWithResponse(commandType);
                    return _get(Entry.hw.portData, ['payload', 'sensorData', value], -1);
                },
            },
            microbit_get_accelerometer: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: '가속도 센서 %1의 값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['x축', 0], ['y축', 1], ['z축', 2], ['크기', 3]],
                        value: 'x',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'microbitSensor',
                isNotFor: ['microbit'],
                def: {
                    type: 'microbit_get_accelerometer',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommand(functionKeys.GET_ACCELEROMETER, { value });
                    return _get(Entry.hw.portData, 'payload.sensorData.accelerometer', -1);
                },
            },
            microbit_set_servo: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 에 서보 값 %2 출력 %3',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitServo',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['180'],
                        },
                    ],
                    type: 'microbit_set_servo',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = _clamp(script.getNumberValue('VALUE'), 0, 180);
                    this.requestCommand(functionKeys.SET_SERVO, { pinNumber, value });
                },
            },
            microbit_set_servo_period: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 에 서보 펄스 폭을 %2 마이크로초로 설정 %3',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'microbitServo',
                isNotFor: ['microbit'],
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['1500'],
                        },
                    ],
                    type: 'microbit_set_servo_period',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                func: (sprite, script) => {
                    const pinNumber = script.getField('PIN');
                    const value = script.getNumberValue('VALUE');
                    this.requestCommand(functionKeys.SET_SERVO_PERIOD, { pinNumber, value });
                },
            },
        };
    }
}();
module.exports = Entry.Microbit;
