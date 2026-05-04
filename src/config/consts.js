export const Platforms = {
	windows: 'windows',
	mac: 'mac',
	linux: 'linux'
}

// keys

export const UP = '[A'
export const DOWN = '[B'
export const LEFT = '[D'
export const RIGHT = '[C'
export const PAGE_UP = '[5~'
export const PAGE_DOWN = '[6~'
export const ESC = '\u001b'
export const END = '[F'
export const HOME = '[H'
export const CTRL_F10 = '[21;5~'
export const CTRL_F9 = '[20;5~'
export const SHIFT_UP = '[1;2A'
export const SHIFT_DOWN = '[1;2B'
export const SUPR = '[3~'
export const BACKSPACE = 127
export const RETURN = 13

// mouse

export const Mouse_Button_Wheel_Up = 'wheelUp'
export const Mouse_Button_Wheel_Down = 'wheelDown'
export const Mouse_Button_Left = 'left'
export const Mouse_Button_Right = 'right'
export const Mouse_Button_Middle = 'middle'
export const Mouse_Action_Press = 'press'
export const Mouse_Action_Drag = 'drag'
export const Mouse_Action_Release = 'release'

// reserved variables ids

export const VarCli_LastCommandResult = '='
export const VarCli_LastError = '#'
export const VarCli_LastCommand = '!'

// ids

export const TUIAgentId = 'TUI'
export const DefaultSessionId = 'default'

// config directives

export const ConfigAppendInstructions = '_appendInstructions'
export const ConfigMergePropsFromPath = '_mergePropsFromPath'
export const ConfigMergeProps = '_mergeProps'

// dialogs contexts nodes types

export const DialogContext_Root = 'root'
export const DialogContext_Switch = 'switch'
export const DialogContext_Completion = 'completion'
export const DialogContext_Assistant = 'assistant'
export const DialogContext_ErrorSpeak = 'error speak'
export const DialogContext_UserSpeak = 'user speak'
export const DialogContext_User = 'user'
export const DialogContext_Tool = 'tool'
export const DialogContext_Tool_Loop = 'tool_loop'

// dialog contexts specials sources and targets

export const FROM_CLI = 'CLI'
export const TO_CLI = 'CLI'
export const FROM_USER = 'USER'
export const TO_USER = 'USER'

// ai tools responses types

export const Tool_Output_Format_Json = 'Tool_Output_Format_Json'
export const Tool_Output_Format_JsonMD = 'Tool_Output_Format_JsonMD'
export const Tool_Output_Format_PlainText = 'Tool_Output_Format_PlainText'
