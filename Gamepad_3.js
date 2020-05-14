class Gamepad {
    //Converted from https://cdn.rawgit.com/bobbybee/scratch-gamepad/master/ext.js to Scratch 3.0 using Ext2to3!
    getInfo() {
        return {
            "id": "Gamepad",
            "name": "Gamepad",
            "blocks": [{
                "opcode": "installed",
                "blockType": "Boolean",
                "text": "Gamepad Extension installed?",
                "arguments": {}
            }, {
                "opcode": "getButton",
                "blockType": "Boolean",
                "text": "button [name] pressed?",
                "arguments": {
                    "name": {
                        "type": "string",
                        "menu": "button",
                        "defaultValue": "X"
                    }
                }
            }, {
                "opcode": "getStick",
                "blockType": "reporter",
                "text": "[what] of [stick] stick",
                "arguments": {
                    "what": {
                        "type": "string",
                        "menu": "axisValue",
                        "defaultValue": "direction"
                    },
                    "stick": {
                        "type": "string",
                        "menu": "stick",
                        "defaultValue": "left"
                    }
                }
            }],
            "menus": {
                button: this._formatMenu(['left top', 'left bottom', 'right top', 'right bottom', 'left stick', 'right stick', 'A', 'B', 'X', 'Y', 'select', 'start', 'up', 'down', 'left', 'right']),
                stick: this._formatMenu(['left', 'right']),
                axisValue: this._formatMenu(['direction', 'force']),
            }
        };
    }
    installed({}) {
        return true;
    }
    getButton({
        name
    }) {
        var index = buttonNames[name];
        var button = ext.gamepad.buttons[index];
        return button.pressed;
    }
    getStick({
        what,
        stick
    }) {
        var x, y;
        switch (stick) {
            case "left":
                x = ext.gamepad.axes[0];
                y = -ext.gamepad.axes[1];
                break;
            case "right":
                x = ext.gamepad.axes[2];
                y = -ext.gamepad.axes[3];
                break;
        }
        if (-DEADZONE < x && x < DEADZONE) x = 0;
        if (-DEADZONE < y && y < DEADZONE) y = 0;

        switch (what) {
            case "direction":
                if (x === 0 && y === 0) {
                    // report the stick's previous direction
                    return ext.stickDirection[stick];
                }
                var value = 180 * Math.atan2(x, y) / Math.PI;
                ext.stickDirection[stick] = value;
                return value;
            case "force":
                return Math.sqrt(x * x + y * y) * 100;
        }
    }
    _formatMenu(menu) {
        const m = [];
        for (let i = 0; i < menu.length; i++) {
            const obj = {};
            obj.text = menu[i];
            obj.value = i.toString();
            m.push(obj);
        }
        return m;
    }
}
Scratch.extensions.register(new Gamepad());