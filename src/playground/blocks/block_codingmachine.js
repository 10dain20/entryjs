'use strict';
Entry.Codingmachine = {
    name: 'Codingmachine',
    url: 'http://wonn.co.kr/',
    imageName: 'codingmachine.png', //thumbnail
    title: {
        "ko": '�ڵ��ӽ�',
        "en": 'Codingmachine'
    },
    Cmd: {
        LED: 1,
        TUNE: 2,
        TUNEDUR: 3,
        ROLL: 4,
        PITCH: 5,
        YAW: 6,
        THROTTLE: 7,
        OPTION: 8,
        MOTOR0: 9,
        MOTOR1: 10,
        MOTOR2: 11,
        MOTOR3: 12,
        DIGITAL_OUT1: 13,
        DIGITAL_OUT2: 14,
        DIGITAL_OUT3: 15,
        DIGITAL_PWM: 16,
        SERVOPORT: 17,
        SERVODGREE: 18,
    },
    Sensor: {
        JOYSTICK_LLR: 1,
        JOYSTICK_LTB: 2,
        JOYSTICK_RLR: 3,
        JOYSTICK_RTB: 4,
        BUTTON: 5,
        DRONECONNECT: 6,
        ULTRASONIC: 7,
        GYRO_X: 8,
        GYRO_Y: 9,
        DRONEREADY: 10,
        /*�߰�*/
        DIGITAL_IN1: 11,
        DIGITAL_IN2: 12,
        ANALOG_A4: 13,
        ANALOG_A5: 14,
        /*�߰�*/
    },
    setZero: function () {
        Entry.hw.sendQueue.CMD = [
            0xf0,
            0x00,
            0x00,
            0x00,
            0x64,
            0x64,
            0x64,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            /* -------- �߰� ------- */
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            /* -------- �߰� ------- */
        ];
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hw/coconut.png',
        width: 256,
        height: 256,
        listPorts: {
            'CMD[1]': {
                name: Lang.Blocks.coconut_sensor_temperature,
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            accelerationX: {
                name: Lang.Blocks.coconut_sensor_acceleration_x,
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            accelerationY: {
                name: Lang.Blocks.coconut_sensor_acceleration_y,
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            accelerationZ: {
                name: Lang.Blocks.coconut_sensor_acceleration_z,
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
        },
        ports: {
            leftProximityValue: {
                name: Lang.Blocks.coconut_sensor_left_proximity,
                type: 'input',
                pos: {
                    x: 122,
                    y: 156,
                },
            },
            rightProximityValue: {
                name: Lang.Blocks.coconut_sensor_right_proximity,
                type: 'input',
                pos: {
                    x: 10,
                    y: 108,
                },
            },
            leftFloorValue: {
                name: Lang.Blocks.coconut_sensor_left_floor,
                type: 'input',
                pos: {
                    x: 100,
                    y: 234,
                },
            },
            rightFloorValue: {
                name: Lang.Blocks.coconut_sensor_right_floor,
                type: 'input',
                pos: {
                    x: 13,
                    y: 180,
                },
            },
            light: {
                name: Lang.Blocks.coconut_sensor_light,
                type: 'input',
                pos: {
                    x: 56,
                    y: 189,
                },
            },
        },
        mode: 'both',
    },
};
Entry.Codingmachine.setLanguage = function () {
    return {
        ko: {
            template: {
                codingmachine_altitude: '����� %1 ���̸�ŭ ������ %2',
                codingmachine_button: '%1�� ��ư �� �о����',
                codingmachine_connect: '��� ���� ���� �о����',
                codingmachine_emergency: '����� ��� ���߱� %1',
                codingmachine_gyro: '���� %1 ���� �� �о����',
                codingmachine_joystick: '���̽�ƽ %1 �б�',
                codingmachine_led: '%1 LED %2  %3',
                codingmachine_motor: '%1 ���͸� %2 ����� ������ %3',
                codingmachine_ready: '��� ���� �غ� ���� �о����',
                codingmachine_rollpitch: '����� %1 ���� %2 ����� �����̱� %3',
                codingmachine_throttle: '��� �����緯�� %1 ��ŭ ����� ������ %2',
                codingmachine_tune: '%1 ����  %2 �ʵ��� �Ҹ����� %3',
                codingmachine_ultrasonic: '�Ÿ�(������)�� �о����',
                codingmachine_yaw: '����� %1 ��ŭ ȸ���ϱ� %2',
                codingmachine_digital_out: '������ %1�� �� %2',
                codingmachine_digital_in: '������ %1 ���� �о����',
                codingmachine_analog_in: '�Ƴ��α� %1 �� ������',
                codingmachine_digital_pwm: '������ ��� %1 �� ����� ����ϱ� %2',
                codingmachine_servo: '������  %1 ���� �������͸� %2 ������ ���ϱ�',
            }
        },
        en: {
            template: {
                codingmachine_altitude: '����� %1 ���̸�ŭ ������ %2',
                codingmachine_button: '%1�� ��ư �� �о����',
                codingmachine_connect: '��� ���� ���� �о����',
                codingmachine_emergency: '����� ��� ���߱� %1',
                codingmachine_gyro: '���� %1 ���� �� �о����',
                codingmachine_joystick: '���̽�ƽ %1 �б�',
                codingmachine_led: '%1 LED %2  %3',
                codingmachine_motor: '%1 ���͸� %2 ����� ������ %3',
                codingmachine_ready: '��� ���� �غ� ���� �о����',
                codingmachine_rollpitch: '����� %1 ���� %2 ����� �����̱� %3',
                codingmachine_throttle: '��� �����緯�� %1 ��ŭ ����� ������ %2',
                codingmachine_tune: '%1 ����  %2 �ʵ��� �Ҹ����� %3',
                codingmachine_ultrasonic: '�Ÿ�(������)�� �о����',
                codingmachine_yaw: '����� %1 ��ŭ ȸ���ϱ� %2',
                codingmachine_digital_out: '������ %1�� �� %2',
                codingmachine_digital_in: '������ %1 ���� �о����',
                codingmachine_analog_in: 'analog %1 sensor',
                codingmachine_digital_pwm: '������ ��� %1 �� ����� ����ϱ� %2',
                codingmachine_servo: '������  %1 ���� �������͸� %2 ������ ���ϱ�',
            }
        }
    }
}
Entry.Codingmachine.getBlocks = function () {
    return {
        //region JDKit
        /* ----------- �߰� --------- */
        codingmachine_analog_in: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A4', 1],
                        ['A5', 2],
                    ],
                    value: 1,
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'codingmachine_analog_in',
            },
            paramsKeyMap: {
                ANALOG_SENSOR: 0,
            },
            class: 'codingmachine_arduino',
            isNotFor: ['Codingmachine'],
            func: function (sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                var analog_sel = script.getField('ANALOG_SENSOR');
                if (analog_sel == 1)
                    return sensorData[Entry.Codingmachine.Sensor.ANALOG_A4];
                else if (analog_sel == 2)
                    return sensorData[Entry.Codingmachine.Sensor.ANALOG_A5];
                else return sensorData[Entry.Codingmachine.Sensor.ANALOG_A4];
            },
            syntax: { js: [], py: [] },
        },
        /* ----------- �߰� --------- */
        codingmachine_joystick: {
            template: Lang.template.jdkit_joystick,
            parent: 'jdkit_joystick',
            def: {
                params: [null],
                type: 'codingmachine_joystick',
            },
            isNotFor: ['Codingmachine'],
            },
            syntax: { js: [], py: [] },
       
        /* ----------- �߰� --------- */
        codingmachine_digital_in: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        //3,4,5,6,7,11,12,13
                        ['D3', 0],/*D3,D7*/
                        ['D4', 1],/*D4*/
                        ['D5', 2],/*D5*/
                        ['D6', 3],/*D6*/
                        ['D7', 4],
                        ['D11', 5],
                        ['D12', 6],
                        ['D13', 7],
                    ],
                    value: 0,
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'codingmachine_digital_in',
            },
            paramsKeyMap: {
                DIGITAL_PIN: 0,
            },
            class: 'codingmachine_arduino',
            isNotFor: ['Codingmachine'],
            func: function (sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                var digital_pin = script.getField('DIGITAL_PIN');
                if (digital_pin <= 3) {
                    return sensorData[Entry.Codingmachine.Sensor.DIGITAL_IN1] & (0x01 << digital_pin) ? 0 : 1;
                }
                else if (digital_pin == 4) {
                    return sensorData[Entry.JDKit.Codingmachine.DIGITAL_IN2] & (0x01 << 0) ? 0 : 1;
                }
                else {
                    return sensorData[Entry.Codingmachine.Sensor.DIGITAL_IN2] & (0x01 << (digital_pin - 4)) ? 0 : 1;
                }
            },
            syntax: { js: [], py: [] },
        },
        /* ----------- �߰� --------- */
        codingmachine_button: {
            template: Lang.template.jdkit_button,
            parent: 'jdkit_button',
            def: {
                params: [null],
                type: 'codingmachine_button',
            },
           isNotFor: ['Codingmachine'],
           
            },
            syntax: { js: [], py: [] },
        
        codingmachine_gyro: {
            template: Lang.template.jdkit_gyro,
            parent: 'jdkit_gyro',
            def: {
                params: [null],
                type: 'codingmachine_gyro',
            },
            isNotFor: ['Codingmachine'],
        },        
            syntax: { js: [], py: [] },
       
        codingmachine_ultrasonic: {
            template: Lang.template.jdkit_ultrasonic,
            parent:'jdkit_ultrasonic',
            def: {
                params: [null],
                type: 'codingmachine_ultrasonic',
            },
            isNotFor: ['Codingmachine'],
           
            },
            syntax: { js: [], py: [] },
        
        codingmachine_connect: {
            template: Lang.template.jdkit_connect,
            parent: 'jdkit_connect',
            def: {
                params: [null],
                type: 'codingmachine_connect',
            },
           isNotFor: ['Codingmachine'],
                        },
            syntax: { js: [], py: [] },
        
        codingmachine_ready: {
            template: Lang.template.jdkit_ready,
            parent: 'jdkit_ready',
            def: {
                params: [null],
                type: 'codingmachine_ready',
            },
           
            isNotFor: ['Codingmachine'],
           
            },
            syntax: { js: [], py: [] },
        
        /* -------- �߰� ------- */
        codingmachine_servo: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D3', 3],
                        ['D4', 4],
                        ['D5', 5],
                        ['D6', 6],
                        ['D7', 7],
                        ['D11', 11],
                        ['D12', 12],
                        ['D13', 13],
                    ],
                    value: 3,
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '180',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'codingmachine_servo',
            },
            paramsKeyMap: {
                DIGITAL_PIN: 0,
                ACTION: 1,
            },
            class: 'codingmachine_arduino',
            isNotFor: ['Codingmachine'],
            func: function (sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0,
                        0,
                        0,
                        0,
                        100,
                        100,
                        100,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        /* -------- �߰� ------- */
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        /* -------- �߰� ------- */
                    ];
                var cmd = Entry.hw.sendQueue.CMD;
                var digital_pin = script.getField('DIGITAL_PIN', script);
                var act_val = script.getNumberValue('ACTION', script);
                cmd[Entry.Codingmachine.Cmd.SERVOPORT] |= digital_pin;
                cmd[Entry.Codingmachine.Cmd.SERVODGREE] = act_val;
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        /* -------- �߰� ------- */
        /* -------- �߰� ------- */
        codingmachine_digital_pwm: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D3', 1],
                        ['D5', 2],
                        ['D6', 3],
                        ['D11', 4],
                    ],
                    value: 1,
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '100',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'codingmachine_digital_pwm',
            },
            paramsKeyMap: {
                DIGITAL_PIN: 0,
                ACTION_VALUE: 1,
            },
            class: 'codingmachine_arduino',
            isNotFor: ['Codingmachine'],
            func: function (sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0,
                        0,
                        0,
                        0,
                        100,
                        100,
                        100,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        /* -------- �߰� ------- */
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        /* -------- �߰� ------- */
                    ];
                var cmd = Entry.hw.sendQueue.CMD;
                var digital_pin = script.getField('DIGITAL_PIN', script);
                var act_value = script.getNumberValue('ACTION_VALUE', script);
                cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT3] = ((digital_pin << 4) & 0xf0);
                cmd[Entry.Codingmachine.Cmd.DIGITAL_PWM] = act_value;
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        /* -------- �߰� ------- */
        /* -------- �߰� ------- */
        codingmachine_digital_out: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        //3,4,5,6,7,11,12,13
                        ['D3', 0],/*D3,D7*/
                        ['D4', 1],/*D4*/
                        ['D5', 2],/*D5*/
                        ['D6', 3],/*D6*/
                        ['D7', 4],
                        ['D11', 5],
                        ['D12', 6],
                        ['D13', 7],
                    ],
                    value: 0,
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.jdkit_led_turnon, 3],
                        [Lang.Blocks.jdkit_led_turnoff, 4],
                    ],
                    value: 3,
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'codingmachine_digital_out',
            },
            paramsKeyMap: {
                DIGITAL_PIN: 0,
                ACTION: 1,
            },
            class: 'codingmachine_arduino',
            isNotFor: ['Codingmachine'],
            func: function (sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0,
                        0,
                        0,
                        0,
                        100,
                        100,
                        100,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        /* -------- �߰� ------- */
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        /* -------- �߰� ------- */
                    ];
                var cmd = Entry.hw.sendQueue.CMD;
                var digital_pin = script.getField('DIGITAL_PIN', script);
                var act = script.getField('ACTION', script);
                if (act == 3) {
                    if (digital_pin <= 2) {//D3, D4, D5
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT1] |= (0x01 << (digital_pin * 2 + 1));
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT1] |= (0x01 << digital_pin * 2);
                    }
                    else if (digital_pin <= 5) {//D6, D7, D11
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT2] |= (0x01 << ((digital_pin - 3) * 2 + 1));
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT2] |= (0x01 << (digital_pin - 3) * 2);
                    }
                    else {   //D12, D13
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT3] |= (0x01 << ((digital_pin - 6) * 2 + 1));
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT3] |= (0x01 << (digital_pin - 6) * 2);
                    }
                }
                else {
                    if (digital_pin <= 2) {
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT1] |= (0x01 << (digital_pin * 2 + 1));
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT1] &= ~(0x01 << digital_pin * 2);
                    }
                    else if (digital_pin <= 5) {
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT2] |= (0x01 << ((digital_pin - 3) * 2 + 1));
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT2] &= ~(0x01 << (digital_pin - 3) * 2);
                    }
                    else {
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT3] |= (0x01 << ((digital_pin - 6) * 2 + 1));
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT3] &= ~(0x01 << (digital_pin - 6) * 2);
                    }
                }
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        /* -------- �߰� ------- */
        codingmachine_led: {
            template: Lang.template.jdkit_led,
            parent: 'jdkit_led',
            def: {
                params: [null],
                type: 'codingmachine_led',
            },
            
            isNotFor: ['Codingmachine'],
        },
            syntax: { js: [], py: [] },
        
        codingmachine_tune: {
            template: Lang.template.jdkit_tune,
            parent:'jdkit_tune',
            def: {
                params: [null],
                type: 'codingmachine_tune',
            },
            
            isNotFor: ['Codingmachine'],
            
            },
            syntax: { js: [], py: [] },
        
        codingmachine_motor: {
            template: Lang.template.jdkit_motor,
            parent: 'jdkit_motor',
            def: {
                params: [null],
                type: 'codingmachine_motor',
            },
           
            isNotFor: ['Codingmachine'],
            
            },
            syntax: { js: [], py: [] },
        
        codingmachine_throttle: {
            template: Lang.template.jdkit_throttle,
            parent:'jdkit_throttle',
            def: {
                params: [null],
                type: 'codingmachine_throttle',
            },
           
            isNotFor: ['Codingmachine'],
            
            },
            syntax: { js: [], py: [] },
        
        codingmachine_altitude: {
            template: Lang.template.jdkit_altitude,
            parent: 'jdkit_altitude',
            def: {
                params: [null],
                type: 'codingmachine_altitude',
            },
            
            isNotFor: ['Codingmachine'],
            
            },
            syntax: { js: [], py: [] },
        
        codingmachine_rollpitch: {
            template: Lang.template.jdkit_rollpitch,
            parent: 'jdkit_rollpitch',
            def: {
                params: [null],
                type: 'codingmachine_rollpitch',
            },
            
            isNotFor: ['Codingmachine'],
            
            },
            syntax: { js: [], py: [] },
        
        codingmachine_yaw: {
            template: Lang.template.jdkit_yaw,
            parent: 'jdkit_yaw',
            def: {
                params: [null],
                type: 'codingmachine_yaw',
            },
            
            isNotFor: ['Codingmachine'],
            
            },
            syntax: { js: [], py: [] },
        
        codingmachine_emergency: {
            template: Lang.template.jdkit_emergency,
            parent:'jdkit_emergency',
            def: {
                params: [null],
                type: 'codingmachine_emergency',
            },
            
            isNotFor: ['Codingmachine'],
            
            },
            syntax: { js: [], py: [] },
        
        //endregion JDKit
    };
};