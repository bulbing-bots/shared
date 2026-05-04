import OutputContext from "./output-context"
import PartialContentAccumulatorSplitter from "../utils/text/partial-content-accumulator-splitter"
import Logger from "../components/sys/logger"
import { DialogContext_Completion, FROM_CLI, TO_USER } from "../config/consts"

export default class DialogContext {

	static id_count = 0
	ctx = null

	// ----- hierarchical properties -----

	parentDialogContext = null
	childDialogContexts = []

	// ----- content  -----

	messages = []
	reasoningContent = []
	documents = []

	// ----- states -----

	userOutputContext = null
	systemOutputContextStart = null
	systemOutputContext = null
	systemMessageCompletion = null
	systemResponseContentAccumulator = null

	// ----- context -----

	dialoger = null

	agent = null			// target agent
	fromAgent = null		// source agent
	from = null				// from not agent source
	to = null				// to not agent source

	round = 0

	task = null
	previousTasks = []

	// ----- properties -----

	nodeType = null

	// -----------------------

	static empty(ctx, nodeType) {
		const dc = new DialogContext(
			ctx,
			null,
			null,
			null,
			null,
			null,
			0,
			nodeType,
			null,
			null,
			new Object())
		if (nodeType) dc.nodeType = nodeType
		dc.systemResponseContentAccumulator = null
		dc.systemMessageCompletion = null
		return dc
	}

	setParent(dialogContext) {
		this.parentDialogContext = dialogContext
		return this
	}

	/**
	 * hierarchically add a sub dialog context (init its parent)
	 * @param {DialogContext} dialogContext
	 * @returns this
	 */
	addChildDialogContext(dialogContext) {
		this.childDialogContexts.push(dialogContext)
		dialogContext.setParent(this)
		return this
	}

	addMessage(message) {
		this.messages.push(message)
		return this
	}

	addResponse(response) {
		var m = response.message.content || ''
		if (response.tool_calls && response.tool_calls.lenngth > 0)
			m += JSON.stringify(response.tool_calls)
		this.messages.push({
			role: response.message.role,
			content: m
		})
		return this
	}

	addPartialMessageCompletion(message) {
		if (this.systemMessageCompletion == null)
			this.systemMessageCompletion = ''
		this.systemMessageCompletion += message
	}

	setPartialMessageCompletion(message) {
		this.systemMessageCompletion = message
	}

	/**
	 * build a new DialogContext necessary to initiale a dialog
	 * @param {Object} ctx app context
	 * @param {OutputContext} outputContext current output context
	 * @param {Object} dialoger dialoger to be used
	 * @param {Object} agent loaded agent specification (ctx.components.agents.agents)
	 * @param {Object} fromAgent dialog initiator if is afent or null if from user, loaded agent specification (ctx.components.agents.agents)
	 * @param {Object} task running task if any
	 * @param {number} round round number
	 */
	constructor(
		ctx,
		outputContext,
		dialoger,
		agent,
		fromAgent = null,
		task = null,
		round = 1,
		nodeType = DialogContext_Completion,
		userOutputContext = null,
		systemOutputContext = null,
		systemResponseContentAccumulator = null,
		reasoningContent = '',
		parentDialogContext = null,
		from = null,
		to = null
	) {
		this.ctx = ctx
		this.outputContext = outputContext
		this.dialoger = dialoger

		if (typeof fromAgent == 'string')
			this.from = fromAgent
		else
			this.fromAgent = fromAgent
		if (from)
			this.from = from

		if (typeof agent == 'string')
			this.to = agent
		else
			this.agent = agent
		if (to)
			this.to = to

		this.task = task
		this.round = round || 1
		this.userOutputContext = userOutputContext
		this.systemOutputContext = systemOutputContext
		this.nodeType = nodeType
		this.systemResponseContentAccumulator = systemResponseContentAccumulator
			|| new PartialContentAccumulatorSplitter(dialoger.ctx)
		this.systemMessageCompletion = null
		this.reasoningContent = reasoningContent
		this.messages = []

		this.parentDialogContext = parentDialogContext
		this.childDialogContexts = []

		this.id = DialogContext.id_count
		DialogContext.id_count++
		this.logDc()
	}

	toString() {
		var from = this.from || this.fromAgent?.id
		var to = this.to || this.agent?.id
		var idDecorator = id => {
			if (!id) return id
			if (id != FROM_CLI && id != TO_USER)
				id = '🤖 ' + id
			return id
		}
		from = idDecorator(from)
		to = idDecorator(to)
		const dir =
			(!from && !to) ? '' :
				`${from} -> ${to}`
		const nt = this.nodeType?.padEnd(12)
		const s = `${this.getMargin()}DialogContext: #${this.id} ${nt} [${this.round}] ${dir}`
		return s
	}

	logDc() {
		Logger.log(this.toString())
		return this
	}

	getMargin(n = 0) {
		return !this.round ? '' : ' '.repeat((this.round - 1 + n) * 3)
	}

	/**
	 * - clone, with eventually round,from,to,fromAgent,toAgent update
	 * - keep properties
	 * - result dialog context has no child nodes. but parent preserved
	 * @param {*} nodeType
	 * @param {*} incRound
	 * @param {*} from
	 * @param {*} to
	 * @param {*} fromAgent
	 * @param {*} toAgent
	 * @returns {DialogContext}
	 */
	clone(nodeType, incRound, from, to, fromAgent, toAgent) {

		const dc = new DialogContext(
			this.ctx,
			this.outputContext,
			this.dialoger,
			toAgent || this.agent,
			fromAgent || this.fromAgent,
			this.task,
			incRound ? this.round + 1 : this.round,
			nodeType || this.nodeType,
			this.userOutputContext,
			this.systemOutputContext,
			this.systemResponseContentAccumulator,
			this.reasoningContent,
			this.parentDialogContext,
			from,
			to
		)
		return dc
	}

	withType(nt) {
		this.nodeType = nt
		return this
	}

	nextRound() {
		this.round++
		return this
	}

	setCurrentTask(task) {
		if (this.task != null)
			this.previousTasks.push(this.task)
		this.task = task
		return this
	}

}
