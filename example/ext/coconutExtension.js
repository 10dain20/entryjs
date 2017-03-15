/**
 * @file    :   coconutExtension.js
 * @author  :   keunja kim 
 * @version :   0.11.0
 * @date    :   2017.01.23
 * @details :   2016.10.06 reset �߰�\n
 *          :   2017.03.06 ���ڳӿ����� ����
 */
var Exten = (function(ext) {
	var root = ext;
	var Module;

	if(typeof exports !== 'undefined') {
        Module = exports;
    } else {
        Module = root.Module = {};
    }

    var device = null;
    var _rxBuf = [];

    // device id
    var devices = {
        "LightSensor": 14,
        "Accelerometer": 18,
        "Temperature": 21,
        "Buzzer": 3,
        "IRdistance": 5,
        "Linetracer": 7,
        "IR": 9,
        "RGBled": 25,
        "Motor": 26,
        "LedMatrix": 27,    //1b
        "Digital": 30,
        "Analog": 31,
        "PWM": 32,
        "External": 40,
        "Speaker": 41,
        "ExtIR": 42,
        "ServoMotor": 43,
        "ExLed": 44,
        "ExtCds": 45
    };

    // buzzer variables
    // ����
    /*var tones = { "C4": 262, "CS4": 277, "D4": 294, "DS4": 311, 
                 "E4": 330, "F4": 349,  "FS4": 370, "G4": 392, "GS4": 415, 
                 "A4": 440, "AS4": 466, "B4":  494, "C5": 523, "CS5": 554, 
                 "D5": 587, "DS5": 622, "E5": 659, "F5": 698, "FS5": 740, 
                 "G5": 784, "GS5": 831, "A5": 880, "AS5": 932, "B5": 988 };*/
    // �ø�, ����
    var sharps = {"-": 0, "#": 1, "b": 2};
    
    // ����: ��ǥ, ��ǥ ���� 
    var beats = { "Half": 500, "Quater": 250, "Eighth": 125, "Sixteenth": 63, "Thirty-second": 32, "Whole": 1000, "Dotted half": 750, "Dotted quarter": 375, "Dotted eighth": 188, "Dotted sixteenth": 95, "Dotted thirty-second": 48, "Double": 2000, "Zero": 0 };
    //var noteDefault = '0';  // ��ε� �⺻��

    var melodys = {"Twinkle Twinkle little star": 1, "Three bears": 2, "Mozart's Lullaby": 3, "Do-Re-Mi": 4, "Butterfly": 5};

    var directions = {"Both": 0, "Left": 1, "Right": 2, "Forward": 3, "Backward": 4}; 
    
    var colors = { "Black": 0, "White": 1, "Red": 2, "Green": 3, "Blue": 4, "Yellow": 5, "Cyan": 6, "Magenta": 7 }; 
    
    // IR distance ��������
    var detectConds = {"Yes": 1, "No": 0};
    
    /// ��Ʈ��Ʈ���� ���� 
    // �ҹ���
    var sLetters = {"a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5, "g": 6, "h": 7, "i": 8, "j": 9, "k": 10, "l": 11, "m": 12, "n": 13, "o": 14, "p": 15, "q": 16, "r": 17, "s": 18, "t": 19, "u": 20, "v": 21, "w": 22, "x": 23, "y": 24, "z": 25};
    // �빮��
    var cLetters = {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25};
    // �ѱ�
    var kLetters = {"ga": 0, "na": 1, "da": 2, "la": 3, "ma": 4, "ba": 5, "sa": 6, "aa": 7, "ja": 8, "cha": 9, "ka": 10, "ta": 11, "pa": 12, "ha": 13};
    var onOffs = {"On": 1, "Off": 0};
    
    var axiss = { "X-Axis": 1, "Y-Axis": 2, "Z-Axis": 3 };
    
    // motor
    var speed = 60;    // ���� �⺻�ӵ�
    
    // external
    var pins = {"D4": 4, "D10": 10, "D11": 11, "D12": 12, "A2": 16, "A3": 17};
    
    var outputValues = {"HIGH": 1, "LOW": 0};
    
    var values = {};

    ext.resetAll = function() {
        device.send([0xff, 0x55, 2, 0, 4]);
		var bytes_1 = [0xff, 0x55, 0, 0, 2];
		return bytes_1;
    };

    //Coconut�� ���� ����
    var tempBytes = {};

    // coconut Program
    ext.runArduino = function() {};

    // motor
    /**
     * @brief   ���� �����̱� - ����/����/��ȸ��/��ȸ��
     * @details �⺻ �ӵ� ����, �ð����� ����
     * @date    2016.04.27
     *
     * @param   direction     ���� (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
     */
    ext.moveMotor = function(direction) {
        if (typeof direction == "string") direction = directions[direction];
        
        // seq, direction, speed, degree, time
        return(runPackage(devices["Motor"], 0, direction, speed));
    };
    
    ext.moveMotorSpeed = function(direction, speed) {
         if (typeof direction == "string") direction = directions[direction];
        
        // seq, direction, speed, degree, time
        return(runPackage(devices["Motor"], 0, direction, speed));
    };
    
    /**
     * @brief   ���� �����̱� - ��ȸ��/��ȸ��
     * @details �⺻ �ӵ� ����, �ð����� ����
     *
     * @param   direction     ���� (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
     */
    ext.turnMotor = function(direction) {
        if (typeof direction == "string") direction = directions[direction];
        
        // seq, direction, speed, degree, time
        return(runPackage(devices["Motor"], 0, direction, speed));
    };
    
    /**
     * @brief   ���� ����
     * @date    2016.06.23
     */
    ext.stopMotor = function() {
        return(runPackage(devices["Motor"], 1));
    };
    
    /**
     * @brief   ����/�������� ���� ��ŭ ����
     * @details �⺻�ӵ� ����, ������ ������ŭ ȸ���� ����
     * @todo    degree<0 �ݴ���� ���� ���� ����
     * @date    2016.04.27
     * @param   direction   ���� (1: Left, 2: Right), default: Left
     * @param   degree      ȸ������ (0~360��), default: 90��
     */
    ext.moveTurnAngle = function(direction, degree) {
        var sec = 0;     // ���Ѿ���
        
        if (typeof direction == "string") direction = directions[direction];
        
        // ������ 360 �̻��� ��� 360���� ����
        if (degree > 360 || degree < -360) degree = 360;
        
        // seq, direction, speed, degree, time
        //motorControl(2, direction, speed, degree, sec);
    };
    
    /**
     * @brief   �����̱� - ��/����, ��/��ȸ�� - �ð�
     * @details �⺻�ӵ� ���� 
     * @date    2016.04.27
     *
     * @param   direction     ���� (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
     * @param   sec         �ð� (��), default: 1��
     */
     ext.moveGoTime = function(direction, sec) {
        // �ð��� 0���� ������ ����� ��ȯ
        if (sec < 0) sec = -sec;
        sec = 1000 * sec; // ms ��ȯ
        
        if (typeof direction == "string") direction = directions[direction];
        
        // seq, direction, speed, degree, time
        return(runPackage(devices["Motor"], 3, direction, speed, short2array(sec)));
    };
    
    /**
     * @brief   ��/��ȸ�� - �ð�
     * @details �⺻�ӵ� ���� 
     *
     * @param   direction     ���� (1: Left, 2: Right), default: Go
     * @param   sec         �ð� (��), default: 1��
     */
     ext.turnMotorTime = function(direction, sec) {
        // �ð��� 0���� ������ ����� ��ȯ
        if (sec < 0) sec = -sec;
        sec = 1000 * sec; // ms ��ȯ
        
        if (typeof direction == "string") direction = directions[direction];
        
        return(runPackage(devices["Motor"], 3, direction, speed, short2array(sec)));
    };
    
    /**
     * @brief   ��/���� ���� ȸ���ϴ� ���� RGB LED �ѱ�
     *
     * @param  direction   ���� (1: Left, 2: Right), default: Left
     * @param  color       RGB LED ���� (1: Red, 2: Green, 3: Blue), default: Red
     */
    ext.moveMotorColor = function(direction, color) {
        var deviceID = devices["Motor"];
        
        if (typeof direction == "string") direction = directions[direction];
        if (typeof color == "string") color = colors[color];
        
        // deviceid, seq, direction, speed, color
        return(runPackage(deviceID, 5, direction, speed, color));
    };
    
    /**
     * @brief   ��/���� ������ ���� ȸ���ϴ� ���� RGB LED �ѱ�
     * @todo    ���� ���� �Ұ�, ���� ����
     * 
     * @param   direction   ���� (1: Left, 2: Right), default: Left
     * @param   angle       ȸ������ (0~360��)
     * @param   color       RGB LED ���� (1: Red, 2: Green, 3: Blue), default: Red
     */
    ext.moveMotorAngleColor = function(direction, angle, color) {
        var deviceID = devices["Motor"];
        
        if (typeof direction == "string") direction = directions[direction];
        if (typeof color == "string") color = colors[color];
        if (typeof angle != "number") angle = 90;
        
        // deviceid, seq, direction, speed, angle, time, color
        return(runPackage(deviceID, 6, direction, short2array(0), short2array(angle), short2array(0), color));
    };
    
    /**
     * @brief   control external motor
     * 
     * @param   direction   ���� (1: Left, 2: Right, 3: Forward, 4: Backward), default: Go
     * @param   speed       �ӵ� (0-255)
     */
    ext.moveExtMotor = function (direction, speed) {
        if (typeof direction == "string") direction = directions[direction];
        
        // deviceid, seq, direction, speed
        return(runPackage(devices["Motor"], 7, direction, speed));
    };
    
    /**
     * @brief   RGB LED �ѱ� - ����, ���� ����
     * @details �ð����� ����, seq=0
     *
     * @date    2016.04.28
     * @param   direction   ���� (0: both, 1: Left, 2: Right), default: Left
     * @param   color       ���� (1: Red, 2: Green, 3: Blue), default: Red
     */
    ext.rgbOn = function(direction, color) {
        if (typeof direction == "string") direction = directions[direction];
        if (typeof color == "string") color = colors[color];
        
        return(runPackage(devices["RGBled"], 0, direction, color));
    };

    /**
     * @brief   RGB LED ���� - ����
     * @details �ð����� ����, seq=1
     *
     * @param   direction    ���� (0: all, 1: Left, 2: Right), default: Left
     */
    ext.rgbOff = function(direction) {
        if (typeof direction == "string") direction = directions[direction];
        
        return(runPackage(devices["RGBled"], 1, direction, 0));
    };
    
    /**
     * @brief   RGB LED ���� - ����, ����
     * @details seq=2
     * @date    2016.05.30
     * 
     * @param   direction   ���� (0: all, 1: Left, 2: Right), default: Left
     * @param   color       ���� (1: Red, 2: Green, 3: Blue), default: Red
     */
    ext.rgbOffColor = function(direction, color) {
        if (typeof direction == "string") direction = directions[direction];
        if (typeof color == "string") color = colors[color];
        
        return(runPackage(devices["RGBled"], 1, direction, color));
    };
    
    /**
     * @brief   RGB LED �ѱ� - ����, ����, �ð�
     * @details seq=2
     * @date    2016.04.28
     * 
     * @param   direction   ���� (0: all, 1: Left, 2: Right), default: Left
     * @param   color       ���� (1: Red, 2: Green, 3: Blue), default: Red
     * @param   sec         �ð�, ��
     */
    ext.ledOnTime = function(direction, color, sec) {
        if (typeof direction == "string") direction = directions[direction];
        if (typeof color == "string") color = colors[color];
        
        // �ð��� ������ �ƴϰų� 0���� ���� ��� 0���� ����
        if (typeof sec != "number") sec = 0;
        else if (sec < 0) sec = 0;  
        else sec *= 1000;   // ms ��ȯ
                
        return(runPackage(devices["RGBled"], 3, direction, color, short2array(sec)));
    };
    
    /// buzzer
    /**
     * @brief   ����Ŀ �ѱ�
     * @details �������� �⺻ ���ļ� c4 �� ª�� �Ҹ�����. 
     */
    ext.beep = function() {
        // c4(262), duration : 50
        //buzzerControl(0, tones["C4"], 50);
        return((buzzerControl(0, 262, 50)));
		// 
    };
    
    /**
     * @brief   �������� seconds ���� �Ҹ����� (�⺻���ļ�)
     * @details �⺻���ļ� : c4 (��)
     * @date    2015.04.26
     * @param   sec ���ֽð� (seconds, ��) 
     */
    ext.playBuzzerTime = function(sec) {
        // �ð��� ���ڰ� �ƴϰų� 0���� ���� ��� 0.5�ʷ� ����
        if (typeof sec != "number") sec = 0.5;
        if (sec < 0) sec = 0.5;
        
        sec = 1000 * sec;  // milliseconds ��ȯ
        
        //buzzerControl(0, tones["C4"], sec);    
        return(buzzerControl(0, 262, sec));    
    };
    
    /**
     * @brief   ������ freq hz�� seconds �� ���� �Ҹ�����
     * @date    2016.04.26
     * @param   freq    ���ļ� hz
     * @param   sec     ���ֽð� (seconds, ��) 
     */
    ext.playBuzzerFreq = function(freq, sec) {
        // �ð��� ���ڰ� �ƴϰų� 0���� ���� ��� 0.5�ʷ� ����
        if (typeof sec != "number") sec = 0.5;
        if (sec < 0) sec = 0.5;
        
        sec = 1000 * sec;  // milliseconds ��ȯ

        // ���ļ��� ���ڰ� �ƴϰų� 0���� ���� ��� 300hz�� ����
        if (typeof freq != "number") freq = 300;
        if (freq < 0) freq = 300;
        
        return(buzzerControl(0, freq, sec));
    };

    /**
     * @brief   ���� ����
     * @details tone = 0 �� ��� ���� ���� ����
     */
    ext.buzzerOff = function() {
        // tone=0, beat=0
        return((buzzerControl(0, 0, 0)));
    };

    /**
     * @brief   ���� tone ���� beat ���ڷ� ����
     * @param   note    ����
     * @param   octave  ��Ÿ��
     * @param   beat    ����
     */
    ext.playBuzzerNote = function(note, octave, beat) {
        
        // note ���� `NOTE_` ���� ���ڿ��� ����
        //var arrNote = note.split("NOTE_",2);
        note = getNote(note);
        
        // ���̸� + ��Ÿ��
       // var tone = note.concat(octave);

        //if (typeof note == "string") tone = tones[tone];
        if (typeof beat == "string") beat = beats[beat];

        // note ascii �ڵ�� ��ȯ�Ͽ� ����
        return(runPackage(devices["Buzzer"], 2, note.charCodeAt(0), octave, short2array(beat)));
    };
    
    /**
     * @brief   ���� tone ���� beat ���ڷ� ����
     * @param   note    ����
     * @param   octave  ��Ÿ��
     * @param   sharp   �ø�ǥ/����ǥ (-:0, #:1, b:2)
     * @param   beat    ����
     */
    ext.playNote = function(note, octave, sharp, beat) {
        
        // note ���� `NOTE_` ���� ���ڿ��� ����
        note = getNote(note);
        
        // ���̸� + ��Ÿ��
       // var tone = note.concat(octave);

        //if (typeof note == "string") tone = tones[tone];
        if (typeof beat == "string") beat = beats[beat];

        // note ascii �ڵ�� ��ȯ�Ͽ� ����
        return(runPackage(devices["Buzzer"], 4, note.charCodeAt(0), octave, sharp.charCodeAt(0), short2array(beat)));
    };
    
    /**
     * @brief   ���� ���� ����
     * @param   note    ���� (eg. NOTE_C)
     */
    function getNote(note) {
        // note ���� `NOTE_` ���� ���ڿ��� ����
        var arrNote = note.split("_");
        
        return arrNote[1];
    }
    
    /**
     * @brief   ���� ����
     * @param   beat    ����
     */
    ext.restBeat = function(beat) {
        if (typeof beat == "string") {
            // Half_rest ���� `_` �� ���ڿ��� �����Ͽ� ���� ����
            var arrBeat = beat.split("_", 1);
            beat = beats[arrBeat];   
         }  
         
        return(buzzerControl(1, 0, beat));
    };

    /** 
     * @brief   ���� tone+octave ���� beat ���ڷ� ����� LED �ѱ�
     * @param  note
     * @param  octave
     * @param  beat
     * @param  color   ���� (1: Red, 2: Green, 3: Blue), default: Red
     */
    ext.playBuzzerColor = function(note, octave, beat, color) {
        // note ���� `NOTE_` ���� ���ڿ��� ����
        //var arrNote = note.split("NOTE_",2);
        note = getNote(note);
        
        // ���̸�+��Ÿ��
        //var tone = note.concat(octave);
        
        //if (typeof note == "string") tone = tones[tone];
        if (typeof beat == "string") beat = beats[beat];
        if (typeof color == "string") color = colors[color];
        
        return(runPackage(devices["Buzzer"], 3, note.charCodeAt(0), octave, short2array(beat), color));
    };
    
    /** 
     * @brief   ���� tone+octave ���� beat ���ڷ� ����� LED �ѱ�
     * @param   note
     * @param   octave
     * @param   sharp       �ø�ǥ/����ǥ (-:0, #:1, b:2)
     * @param   beat
     * @param   direction   Left:1, Right:2, All: 0
     * @param   color       1: Red, 2: Green, 3: Blue, default: Red
     */
    ext.playNoteColor = function(note, octave, sharp, beat, direction, color) {
        // note ���� `NOTE_` ���� ���ڿ��� ����
        note = getNote(note);
        
        if (typeof beat == "string") beat = beats[beat];
        if (typeof direction == "string") direction = directions[direction];
        if (typeof color == "string") color = colors[color];
        
        return(runPackage(devices["Buzzer"], 5, note.charCodeAt(0), octave, sharp.charCodeAt(0), short2array(beat), direction, color));
    };
    
    /**
     * @brief   ��ε� �����ϱ�
     * @param   melody  ��ε� (1:������, 2:��������, 3:���尡, 4:�����̼�, 5:�����)
     */
    ext.playMelody = function(melody) {
        if (typeof melody == "string") melody = melodys[melody];

        return(runPackage(devices["Buzzer"], 6, melody));
    };

    /**
     * @brief   ���� ����
     * @details 
     * @param   seq     ���� (0: ����, 1: ���ڽ���, 2: ��ǥ ����)
     * @param   tone    ���ļ�
     * @param   beat    ����
     * @param   note    ��ǥ
     */
    function buzzerControl(seq, tone, beat) {
        var deviceID = devices["Buzzer"];

        //if (typeof tone == "string") tone = tones[tone];
        if (typeof beat == "string") beat = beats[beat];

        return(runPackage(deviceID, seq, short2array(tone), short2array(beat)));
    }

    // led blink
    ext.runBlink = function() {
        var pin = 13;
        return(runPackage(30, pin));
    };

    /**
     * @brief   ������ �� �б�
     * 
     */
    ext.getLightSensor = function(nextID) {
        getPackage(0, devices["LightSensor"], 0);
    };

    /**
     * @brief   3�� ���ӵ����� �� �б�
     * 
     * @param   axis    �� (X, Y, Z)
     */
    ext.getAccelerometer = function(nextID, axis) {
        if (typeof axis == "string") axis = axiss[axis];
        
        getPackage(nextID, devices["Accelerometer"], 0, axis);
    };

    /// line tracer
    /**
     * @brief   �ٴ� ���ܼ����� �� �б�
     *
     * @param   direction   ����, default Left (1: Left, 2: Right)
     */
    ext.getLineTracer = function(nextID, direction) {
        if (typeof direction == "string") direction = directions[direction];
        
        getPackage(nextID, devices["Linetracer"], 0, direction);
    };
    
     /**
     * @brief   �ٴ� ���ܼ����� ��������
     * 
     * @param   direction   ����, default Left (1: Left, 2: Right)
     * @param   detectCond  ���� ���� (1: ����, 0: �̰���)
     */
    ext.isLineDetected = function(nextID, direction, detectCond) {
        if (typeof direction == "string") direction = directions[direction];
        if (typeof detectCond == "string") detectCond = detectConds[detectCond];
        
        getPackage(nextID, devices["Linetracer"], 1, direction, detectCond);
    };
    
    /**
     * @brief   �ٴ� ���ܼ����� ���� ���� ����
     * @todo    ������ ��� ���� ��� ����
     */
    ext.isLineDetect = function(nextID, direction, color) {
        if (typeof direction == "string") direction = directions[direction];
        if (typeof color == "string") color = colors[color];
        
        getPackage(nextID, devices["Linetracer"], 2, direction, color);
    };
    
    /**
     * @brief   �� ���󰡱�, level=5 (default)
     */
    ext.followLine = function() {
        return(runPackage(devices["Linetracer"], 3, speed));
    };
    
    /**
     * @brief   �� ���󰡱�, �ӵ� ����
     */
    ext.followLineLevel = function(level, speed) {
        if (typeof speed != "number") speed = 70;
        return(runPackage(devices["Linetracer"], 3, level, speed));
    };
    
    /// IR distance
    /**
     * @brief   ��/���� ���漾���� �б�
     *
     * @param   direction   ����, default Left (1: Left, 2: Right)
     */
    ext.getDistance = function(nextID, direction) {
        if (typeof direction == "string") direction = directions[direction];

        getPackage(nextID, devices["IRdistance"], 0, direction);
    };
    
    /**
     * @brief   ��ֹ� ���� ���� ����
     * @date    2016.05.24
     *
     * @param   direction   ����, default Left (1: Left, 2: Right)
     * @param   standard    ���� ����
     */
    ext.setStandard = function(direction, standard) {
        if (typeof direction == "string") direction = directions[direction];
        
        return(runPackage(devices["IRdistance"], 0, direction, standard));
    };
    
    /**
     * @brief   ��/���� ��ֹ� ���� ����
     * @date    2016.05.23
     * 
     * @param   direction   default Left (1: Left, 2: Right, 0: All)
     * @param   detectCond  ���� ���� (1: ����, 0: �̰���)
     */
    ext.isDetectObstacle = function(nextID, direction, detectCond) {
        if (typeof direction == "string") direction = directions[direction];
        if (typeof detectCond == "string") detectCond = detectConds[detectCond];

        getPackage(nextID, devices["IRdistance"], 1, direction, detectCond);
    };

    /**
     * @brief   ��ֹ� ���� (��/���� ����)
     * @details �������  (0: �����ȵ�, 1: ������ ����, 2: ���� ����, 3: �Ѵ� ����)
     * 
     */
    ext.isDetectObstacles = function(nextID) {
        var deviceID = devices["IRdistance"];

        getPackage(nextID, deviceID, 2);
    };
    
    /**
     * @brief   ��̵� ���
     */
    ext.avoidMode = function() {
        return(runPackage(devices["IRdistance"], 3));
    };
    
    /// LED Matrix
    /**
     * @brief   Led Matrix �࿭ �ѱ�
     * 
     * @param   row     �� ��ȣ, 0-8 (Both=0)
     * @param   col     �� ��ȣ, 0-8 (Both=0)
     * @param   onOff   on=1, off=0
     */
    ext.ledMatrixOn = function(onOff, row, col) {
        if (typeof onOff == "string") onOff = onOffs[onOff];
        if ((typeof row=="string") && (row=="Both")) row = 0; 
        if ((typeof col=="string") && (col=="Both")) col = 0; 
        
        return(runPackage(devices["LedMatrix"], 0, row, col, onOff));
    };
    
    /**
     * @brief   Led Matrix �࿭ ����
     * 
     * @param   row �� ��ȣ
     * @param   col �� ��ȣ
     */
    ext.ledMatrixOff = function (row, col) {
        return(runPackage(devices["LedMatrix"], 0, row, col, 0));
    };
    
    /**
     * @brief   Led Matrix ��� ����
     */
    ext.ledMatrixClear = function() {
        return(runPackage(devices["LedMatrix"], 5));    // seq=5
    };
    
    /**
     * @brief   Led Matrix ��� �ѱ�
     */
    ext.ledMatrixOnAll = function() {
        return(runPackage(devices["LedMatrix"], 6));    // seq=6
    };
    
    /**
     * @brief   Led Matrix ���� ǥ��
     * 
     * @param   code ���� (0-9)
     */
    ext.showLedMatrix = function (code) {
        return(runPackage(devices["LedMatrix"], 1, code));
    };
    
    /**
     * @brief   Led Matrix ���� �ҹ��� ǥ��
     * 
     * @param   code �ҹ��� (a-z)
     */
    ext.showLedMatrixSmall = function (code) {
        if (typeof code == "string") code = sLetters[code];
        return(runPackage(devices["LedMatrix"], 2, code));
    };
    
    /**
     * @brief   Led Matrix ���� �빮�� ǥ��
     * 
     * @param   code �빮��(A-Z)
     */
    ext.showLedMatrixLarge = function (code) {
        if (typeof code == "string") code = cLetters[code];
        return(runPackage(devices["LedMatrix"], 3, code));
    };
    
    /**
     * @brief   Led Matrix �ѱ� ǥ��
     * 
     * @param   code �ѱ� (��-��)
     */
    ext.showLedMatrixKorean = function (code) {
        if (typeof code == "string") code = kLetters[code];
        return(runPackage(devices["LedMatrix"], 4, code));
    }
    
    /// IR
    /**
     * @brief   IR �޽��� ������
     *
     * @param   message ������ ���ڿ�
     */
    ext.sendMessage = function(message) {
        return(runPackage(devices["IR"], string2array(message)));
    };

    /**
     * @brief   IR �޽��� �ޱ�
     *
     */
    ext.getMessage = function(nextID) {
        getPackage(nextID, devices["IR"]);
    };

    /**
     * @brief   �µ� ����
     */
    ext.getTemperature = function(nextID) {
        getPackage(nextID, devices["Temperature"], 0);
    };
    
    /// external input/output
    /**
     * @brief   �ܺ� LED on/off
     *
     * @param   pin     ������ �ɹ�ȣ
     * @param   sec     �ð� (ms)
     */
    ext.extLedOn = function(pin, sec) {
        if (typeof pin == "string") pin = pins[pin];
        sec *= 1000;
        
        return(runPackage(devices["ExLed"], pin, short2array(sec)));
    };
    
    /**
     * @brief   �ܺ� speaker �Ҹ�����
     *
     * @param   pin         pwm �ɹ�ȣ
     * @param   freq        ���ļ�
     * @param   duration    �ð� (ms)
     */
    ext.playSpeaker = function(pin, freq, duration) {
        if (typeof pin == "string") pin = pins[pin];
        duration *= 1000;
        
        return(runPackage(devices["Speaker"], pin, short2array(freq), short2array(duration)));
    };
    
    /**
     * @brief   �ܺ� speaker ����
     *
     * @param   pin pwm �ɹ�ȣ
     */
    ext.stopSpeaker = function(pin) {
        if (typeof pin == "string") pin = pins[pin];
        
        return(runPackage(devices["Speaker"], pin, short2array(0), short2array(0)));
    };
    
    /**
     * @brief   read external IR
     *
     * @param   pin analog pin (A2, A3)
     */
    ext.getExtIR = function(nextID, pin) {
        if (typeof pin == "string") pin = pins[pin];
        getPackage(nextID, devices["ExtIR"], pin);
    };
    
    /**
     * @brief   read external Cds
     *
     * @param   pin analog pin (A2, A3)
     */
    ext.getExtCds = function(nextID, pin) {
        if (typeof pin == "string") pin = pins[pin];
        getPackage(nextID, devices["ExtCds"], pin);
    };
    
    /**
     * @brief   run servo motor
     *
     * @param   pin     pwm pins (D10, D11)
     * @param   angle   0~180
     */
    ext.runExtServo = function(pin, angle) {
        if (typeof pin == "string") pin = pins[pin];
        
        return(runPackage(devices["ServoMotor"], pin, angle));
    };
    
    /**
     * @brief   �����а� �б�
     * @date    2016.05.19
     *
     * @param   pin ������ �ɹ�ȣ
     */
    ext.readDigital = function(nextID, pin) {
        getPackage(nextID, devices["Digital"], pin);
    };
    
    /**
     * @brief   �Ƴ��αװ� �б�
     * @date    2016.05.19
     *
     * @param   pin �Ƴ��α� �ɹ�ȣ
     */
    ext.readAnalog = function(nextID, pin) {
        getPackage(nextID, devices["Analog"], pin);
    }
    
    /**
     * @brief   ������ ��� ����
     * @date    2016.05.19
     *
     * @param   pin         ������ �ɹ�ȣ
     * @param   outputValue ��°� (HIGH:1, LOW:0)
     */
    ext.digitalWrite = function (pin, outputValue) {
        if (typeof outputValue == "string") outputValue = outputValues[outputValue];
        return(runPackage(devices["Digital"], pin, outputValue));
    };
    
    /**
     * @brief   �Ƴ��α� ��� ����
     * @date    2016.05.19
     * 
     * @param   pin     �Ƴ��α� �ɹ�ȣ
     * @param   duty    ��Ƽ����Ŭ (0~255)
     */
    ext.analogWrite = function (pin, duty) {
        if (typeof duty != "number") {
            duty = 0;
        }    
        // ��Ƽ����Ŭ�� 255�� �ѱ��� 255�� ���� (100%)
        else if (duty > 255) { 
            duty = 255;
        }//if
        
        return(runPackage(devices["Analog"], pin, duty));
    };

    // common function
    /**
     * @brief ��� ����
     */
    function runPackage() {
        var bytes = [0xff, 0x55, 0, 0, 2];

        for (var i=0; i<arguments.length; i++) {
            if (arguments[i].constructor == "[class Array]") {
                bytes = bytes.concat(arguments[i]);
            } 
			//coconut �� ��
			else if(arguments[i].length == 2) {
				bytes = bytes.concat(arguments[i]);
			}
            else {
                bytes.push(arguments[i]);
            }
        }//for

        bytes[2] = bytes.length-3;  // data length
        
        // ��ġ�� ArrayBuffer data ����
        //device.send(bytes);
	return bytes;

    }//function
    
    /**
     * @brief   ������ �б�
     * 
     */
    function getPackage() {
        var nextID = arguments[0];
        var len = arguments.length;
        
        var bytes = [0xff, 0x55];
        bytes.push(len+1);
        bytes.push(0);
        bytes.push(1);

        for (var i=1; i<len; i++) {
            bytes.push(arguments[i]);
        }//for

        device.send(bytes);
    }//function getPackage

    // ���� ������ ó��
    var _isParseStart = false;
    var _isParseStartIndex = 0;

    function processData(bytes) {
        var len=bytes.length;   // ArrayBuffer �����ͼ�
        if(_rxBuf.length > 30) _rxBuf=[];

        for (var index=0; index<len; index++) {
            var c= bytes[index];
            _rxBuf.push(c);

            if (_rxBuf.length >= 2) {
                if (_rxBuf[_rxBuf.length-1]==0x55 && _rxBuf[_rxBuf.length-2]==0xff) {
                    _isParseStart = true;
                    _isParseStartIndex = _rxBuf.length-2;
                }//if

                if (_rxBuf[_rxBuf.length-1]==0xa && _rxBuf[_rxBuf.length-2]==0xd && _isParseStart) {
                    _isParseStart = false;

                    var position = _isParseStartIndex+2;
                    var extId = _rxBuf[position];
                    position++;
                    var type = _rxBuf[position];
                    position++;

                    //1 byte, 2 float, 3 short, 4 len+string, 5 double
                    var value;
                    switch (type) {
                        case 1:
                            value = _rxBuf[position];
                            position++;
                            break;
                        case 2:
                            value = readFloat(_rxBuf, position);
                            position += 4;
                            if (value<-255 || value>1023) value=0;
                            break;
                        case 3:
                            value = readShort(_rxBuf, position);
                            position+=2;
                            break;
                        case 4:
                            var l = _rxBuf[position];
                            position++;
                            value = readString(_rxBuf, position, l);
                            break;
                        case 5:
                            value = readDouble(_rxBuf, position);
                            position +=4;
                            break;
                    }//switch

                    if (type <= 5) {
                        if (values[extId] != undefined) {
                            responseValue(extId, values[extId](value, extId));
                        } 
                        else {
                            responseValue(extId, value);
                        }

                        values[extId] = null;
                    }//if

                    _rxBuf=[];
                }//if
            }//if
        }//for
    }//function

    function readFloat(arr, position) {
        var f = [arr[position], arr[position+1], arr[position+2], arr[position+3]];
        return parseFloat(f);
    }//function

    function readShort(arr, position) {
        var s = [arr[postion], arr[postion+1]];
        return parseShort(s);
    }//furnction

    function readDouble(arr, position) {
        return readFloat(arr, position);
    }//function

    function readString(arr, position, len) {
        var value = "";
        for (var ii=0; ii<len; ii++) {
            value += String.fromCharCode(_rxBuf[ii+position]);
        }//for

        return value;
    }//function

    // Extension API interactions
    var potentialDevices = [];

    function tryNextDevice() {
        device = potentialDevices.shift();
        if (device) {
            // device.open()
            // options
            //- stopBits : The number of stop bits per character, default:1 (0: 1bit, 1:1.5bit, 2:2bit) 
            //- bitRate : Up to The bit (or baud) rate at which to communicate. default: 9600
            //- ctsFlowControl: The type of flow control to use. default:1 (0:none, 1:software, 2:hardware) 
            //- bufferSize: The maximum amount of data that can be received at a time. default: 4096 (~8192)
            //- dataBits: The number of data bits per character. default: 8 (5,6,7,8)
            //- parityBit: Whether and how to use the parity bit in each character. default:0 (0:none, 1:odd, 2:even)
            device.open({stopBits: 0, bitRate: 115200, ctsFlowControl: 0}, deviceOpened);
        }//if
    }//function

    var watchdog = null;
    function deviceOpened(dev) {
        if (!dev) {
            //opening the port failed
            tryNextDevice();
            return;
        }//if

        // ���ŵ� �����͸� ó���ϴ� �Լ� ���
        device.set_receive_handler('coconut', processData); 
    }//function

    // ��ġ ���� - serial
    ext._deviceConnected = function(dev) {
        potentialDevices.push(dev);

        if(!device) tryNextDevice();
    }//function

    // device connection stop
    ext._deviceRemoved = function(dev) {
        if(device != dev) return;
        device = null;
    }

    // extension ����
    ext._shutdown = function() {
        if(device) device.close();
        device = null;
    }//function

    // �ϵ���� ��ġ�� ����� �Ǿ����� ����
    ext._getStatus = function() {
        // status :  0 (red, error), 1 (yellow, not ready), 2 (green, ready)
        if(!device) return {status: 1, msg: 'coconut not connected'};
        if(watchdog) return {status: 1, msg: 'Probing for coconut'};

        return {status: 2, msg: 'coconut connected'};
    }
	
    //cooonut �� short2array ����
    function short2array(value) {
	for (var i =0; i<2; i++)
	{
	  var tempByte = value & 0xff;
	  tempBytes[i] = tempByte;
	  value = (value - tempByte) / 256;				
	}
	return [tempBytes[0], tempBytes[1]];
    }
    // Register the Extension 
    var descriptor = {};

    // ScrachExtension.register()
    // @param Example Name
    // @param descriptor_object
    // @param ext_instance
    // @param hardware_info or serial_info (optional)
    // 
    // hardware_info = {type: 'hid', vendor: 0x0694, product: 0x0003}
    // - vendor : 16���� (0x0000)
    // - product : 16���� (0x0000 , ��ǰID
    // serial_info = {type: 'serial'}

    //coconut ������ ������ ���� �ּ� ó�� �� ���ϰ� ����
    //ScratchExtensions.register("coconut", descriptor, ext, {type: 'serial'});
    return ext;

//coconut ������ ������ ���� �ּ� ó��
//})({}); 
})(this);