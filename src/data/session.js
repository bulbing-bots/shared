import { getSession, sessionDataFile, sessionPath, toJson } from "../../../shared/src/utils/utils"
import { existsSync, mkdir, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { appendFile, writeFile } from "fs/promises";
import DialogContext from "./dialog-context";
import { RunCommandEvent } from "./events";
import { DialogContext_Root, TUIAgentId } from "../config/consts";
import Vars from "./vars";
import AIAgent from "./ai/ai-agent";

export default class Session {

	id = null
	description = null

	// load time command history
	commandHistory = []

	// loaded plugins / agents
	// loaded agents ids
	agents = null
	// unloaded agents (previously loaded) on session switch
	unloadedAgents = null
	// last current dialog target
	dialogCurrentTargetAgent = null

	// cli env vars
	// context vars
	// user vars
	vars = null

	// root dialog context (dialog tree)
	rootDialogContext = null

	// documents
	documents = null

	// time
	time = {
		up: 0,
		start: 0
	}

	// agents config ? (prompt, instruct, ...)

	constructor(id, ctx) {
		this.id = id
		this.ctx = ctx
		this.rootDialogContext = DialogContext.empty(ctx, DialogContext_Root)
		this.vars = new Vars(this.ctx)
	}

	static get(ctx) {
		return getSession(ctx)
	}

	addChildDialogContext(dialogContext) {
		this.rootDialogContext.addChildDialogContext(dialogContext)
		return dialogContext
	}

	// late init session root data context
	checkRootDataContext(dialogEvent) {
		if (!this.rootDialogContext.dialoger) {
			const dc = dialogEvent.dialogContext
			this.rootDialogContext.outputContext =
				dc.outputContext
			this.rootDialogContext.dialoger =
				dc.dialoger
		}
		return this
	}

	static async load(ctx, id) {
		const p = sessionPath(ctx, id)
		if (!existsSync(p))
			throw new Error('session not found: ' + id)

		const s = await Session.loadFromFile(ctx, id)

		return s
	}

	static async loadFromFile(ctx, id) {
		const f = sessionDataFile(ctx, id)
		if (!existsSync(f)) {
			// new if missing
			return await Session.#buildNewSession(ctx, id)
		}

		// deserialize
		const st = JSON.parse(readFileSync(f).toString())
		const s = new Session(id, ctx)
		s.cloneFrom(st)
		s.id = id	// data model migration
		s.commandHistory = Session.loadCommandHistory(ctx)

		return s
	}

	cloneFrom(s) {
		this.id = s.id
		this.description = s.description
		this.commandHistory = s.commandHistory
		this.agents = s.agents
		this.dialogCurrentTargetAgent = s.dialogCurrentTargetAgent
		this.documents = s.documents
		this.unloadedAgents = s.unloadedAgents
	}

	static async new(ctx, id) {
		const p = sessionPath(ctx)
		if (!existsSync(p))
			mkdir(p, null, (err) => {
				if (err) throw err;
			})
		else
			throw new Error('session already exists: ' + id)
		await Session.#buildNewSession(ctx, id)
		return s
	}

	static async #buildNewSession(ctx, id) {
		const s = new Session(id, ctx)
		Session.newCommandHistory(ctx, id)
		s.commandHistory = Session.loadCommandHistory(ctx)
		await s.save()
		return s
	}

	async save(saveAll = false, forceWait = false) {
		// serialize session data
		const h = this.commandHistory
		const ctx = this.ctx
		const rdc = this.rootDialogContext
		const vars = this.vars

		delete this.commandHistory
		delete this.ctx
		delete this.rootDialogContext
		delete this.vars

		const f = sessionDataFile(ctx, this.id)

		writeFileSync(f, toJson(this))

		this.commandHistory = h
		this.ctx = ctx
		this.rootDialogContext = rdc
		this.vars = vars
		// note: session history is regularly auto-saved
	}

	// ----- agents -----

	async loadAgents(outputContext) {
		const lst = [...this.ctx.agents.list]
		// restore a TUI agent if no one
		if (!this.agents) this.agents = [TUIAgentId]
		var agentsIds = [...this.agents]
		const unloadedAgentsIds = !this.unloadedAgents ? []
			: [... this.unloadedAgents]
		agentsIds = [...agentsIds, ...unloadedAgentsIds]
		agentsIds = [...new Set(agentsIds)]

		this.ctx.cli.restoreDialogCurrentTargetAgent
			= this.dialogCurrentTargetAgent

		for (var i = 0; i < lst.length; i++) {
			const agent = lst[i]
			agent.index = i

			if (agentsIds.includes(agent.id)) {

				await this.ctx.components.agents.loadAgent(
					new AIAgent(
						this.ctx,
						agent),
					outputContext
				)
			}
		}
		if (!agentsIds.includes(this.ctx.cli.dialogCurrentTargetAgent)) {
			if (agentsIds.length > 0)
				this.ctx.cli.restoreDialogCurrentTargetAgent
					= this.ctx.cli.dialogCurrentTargetAgent
					= agentsIds[0]
		}
		this.unloadedAgents = []
	}

	async unloadAgents() {
		const agentsIds = [...this.agents]
		this.unloadedAgents = [... this.agents]
		const e = this.ctx.components.event
		for (var i = 0; i < agentsIds.length; i++) {
			e.emit(RunCommandEvent, 'agent rm ' + agentsIds[i])
		}
	}

	// ----- command history -----

	async updateCommandHistory(cmd) {
		this.commandHistory.push(cmd)
		await appendFile(
			Session.getHistoryFilePath(this.ctx, this.id),
			'\n' + cmd.trim()
		)
	}

	static loadCommandHistory(ctx, id) {
		const h = Session.getHistoryFilePath(ctx, id)
		if (!existsSync(h)) Session.newCommandHistory(ctx, id)
		const histo = readFileSync(h).toString().split('\n')
		return histo
	}

	static newCommandHistory(ctx, id) {
		const h = Session.getHistoryFilePath(ctx, id)
		if (existsSync(h)) return
		writeFileSync(h)
	}

	async saveCommandHistory() {
		const h = Session.getHistoryFilePath(this.ctx, this.id)
		await writeFile(h, this.commandHistory.join('\n'))
	}

	static getHistoryFilePath(ctx, id) {
		return join(sessionPath(ctx, id),
			ctx.paths.commandHistoryFilename);
	}
}
