export const AppInitializedEvent = 'AppInitializedEvent'
export const AppStartedEvent = 'AppStartedEvent'
export const AppExitingEvent = 'AppExitingEvent'

export const CommandOutputEvent = 'CommandOutputEvent'
export const OutputUpdatedEvent = 'OutputUpdatedEvent'
export const OutputResizedEvent = 'OutputResizedEvent'
export const OutputRowsCountUpdatedEvent = 'OutputRowsCountUpdatedEvent'
export const HelpOutputUpdatedEvent = 'HelpOutputUpdatedEvent'
export const BoxOutputUpdatedEvent = 'BoxOutputUpdatedEvent'
export const InputExecutedEvent = 'InputExecutedEvent'
export const InputExecutingEvent = 'InputExecutingEvent'
export const LayoutResizedEvent = 'LayoutResizedEvent'
// this event name is to be completed with source gauge key
export const GaugeSourceUpdatedEvent = 'GaugeSourceUpdatedEvent-'

export const InputSubmitedEvent = 'InputSubmitedEvent'
export const CommandInputStartedEvent = 'CommandInputStartedEvent'
export const InputAddedEvent = 'InputAddedEvent'
export const RunCommandEvent = 'RunCommandEvent'
export const CommandParseErrorEvent = 'CommandParseErrorEvent'
export const CommandNotFoundEvent = 'CommandNotFoundEvent'
export const CommandFileNotFoundEvent = 'CommandFileNotFoundEvent'
export const CommandPluginLoadErrorEvent = 'CommandPluginLoadErrorEvent'
export const CommandRunErrorEvent = 'CommandRunErrorEvent'
export const CommandArgsCountErrorEvent = 'CommandArgsCountErrorEvent'
export const HideInitBoxOutputEvent = 'HideInitBoxOutputEvent'
export const UIFreezeStatedChangedEvent = 'UIFreezeStatedChangedEvent'
export const CommandClearInputEvent = 'CommandClearInputEvent'
export const CommandSetInputEvent = 'CommandSetInputEvent'
export const ConsoleClearedEvent = 'ConsoleClearedEvent'
export const PromptVisibilityLostEvent = 'PromptVisibilityLostEvent'

export const KeyboardInputEvent = 'KeyboardInputEvent'
export const KeyPressedEvent = 'KeyPressedEvent'    // NU
export const KeyboardCaptureRequestEvent = 'KeyboarCaptureRequestEvent'
export const CommandKeyboardCaptureReleaseEvent = 'CommandKeyboardCaptureReleaseEvent'
export const MouseActionEvent = 'MouseActionEvent'

export const SetStatusMessageEvent = 'SetStatusMessageEvent'
export const SetTUIStatusMessageEvent = 'SetTUIStatusMessageEvent'
export const InputToStartEvent = 'InputToStartEvent'
export const InputToEndEvent = 'InputToEndEvent'
export const SpeakCommandEvent = 'SpeakCommandEvent'

export const ListSelectorOpenCommandEvent = 'ListSelectorOpenCommandEvent'

export const AgentAddedEvent = 'AgentAddedEvent'
export const AgentRemovedEvent = 'AgentRemovedEvent'
export const AgentResponseEvent = 'AgentResponseEvent'
export const AgentPartialResponseEvent = 'AgentPartialResponseEvent'
export const AgentPartialReasoningResponseEvent = 'AgentPartialReasoningResponseEvent'
export const AgentGetFocusSpeakEvent = 'AgentGetFocusSpeakEvent'
export const AgentGetFocusViewEvent = 'AgentGetFocusViewEvent'
export const DialogUserPromptBegin = 'DialogUserPromptBegin'

export const PluginLoadedEvent = 'PluginLoadedEvent'
export const PluginUnloadedEvent = 'PluginUnloadedEvent'
export const ResponseProcessorLoadedEvent = 'ResponseProcessorLoadedEvent'

export const TaskRunErrorEvent = 'TaskRunErrorEvent'
export const TaskAddUserDialogCommandEvent = 'TaskAddUserDialogCommandEvent'
export const TaskAddAssistantDialogCommandEvent = 'TaskAddAssistantDialogCommandEvent'
export const TaskAddAssistantMessageCommandEvent = 'TaskAddAssistantMessageCommandEvent'
export const TaskAddThinkCommandEvent = 'TaskAddThinkCommandEvent'
export const TaskAddSpeakCommandEvent = 'TaskAddSpeakCommandEvent'

export const ToolUnknownDialogEvent = 'ToolUnknownDialogEvent'
export const ToolRunCompletedDialogEvent = 'ToolRunCompletedDialogEvent'
export const ToolRunErrorDialogEvent = 'ToolRunEventDialogEvent'
export const ToolRequiredByModelDialogEvent = 'ToolRequiredByModelDialogEvent'
export const ToolLoopDialogEvent = 'ToolLoopDialogEvent'

export const SessionUnLoadedEvent = 'SessionUnLoadedEvent'

export const LogErrorEvent = 'LogErrorEvent'
export const LogWarningEvent = 'LogWarningEvent'

export const dialogEvent = ({
	dialogContext,
	message = null,
	toolSpec = null,
	result = null,
	error = null,
	text = null,
	options = null
}) => {
	return {
		dialogContext: dialogContext,
		message: message,
		toolSpec: toolSpec,
		result: result,
		error: error,
		text: text,
		options: options
	}
}

export const errorEvent = (from, err) => {
	return {
		from: from,
		error: err
	}
}

export const speakEvent = (dialogContext, from, text, voice, waitForEnd, interrupt) => {
	return {
		dialogContext: dialogContext,
		from: from,
		text: text,
		voice: voice,
		waitForEnd: waitForEnd,
		interrupt: interrupt
	}
}

export const mouseEvent = ({ x, y, button, action, shift, alt, ctrl, wheelUp, wheelDown }) => {
	return { x, y, button, action, shift, alt, ctrl, wheelUp, wheelDown }
}

export const agentResponseEvent = (dialogContext, response) => {
	return {
		dialogContext: dialogContext,
		response: response
	}
}

export const agentPartialResponseEvent = (dialogContext, event, partialContent, content, partialReasoningContent, reasoningContent, options) => {
	return {
		dialogContext: dialogContext,
		event: event,
		partialContent: partialContent,
		content: content,
		partialReasoningContent: partialReasoningContent,
		reasoningContent: reasoningContent,
		options: options
	};
}
