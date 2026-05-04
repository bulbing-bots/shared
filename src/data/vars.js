import Var from "./var"

export const VAR_SCOPE_CLI = 'VAR_SCOPE_CLI'
export const VAR_SCOPE_ENV = 'VAR_SCOPE_ENV'
export const VAR_SCOPE_USER = 'VAR_SCOPE_USER'

export default class Vars {

	mem = {}

	constructor(ctx) {
		this.ctx = ctx
		this.init()
	}

	init() {
		if (this.ctx.env) {
			for (const [key, value] of Object.entries(this.ctx.env)) {
				this.set(key, value, VAR_SCOPE_ENV)
			}
		}
	}

	serialize(value) {

	}

	set(key, value, scope = VAR_SCOPE_USER) {
		this.mem[key] = new Var(key, value, scope)
		return this
	}

	get(key) {
		return this.mem[key]
	}

	del(key) {
		delete this.mem[key]
		return this
	}

	list() {
		return { ...this.mem }
	}

	replaceVars(text) {
		return this.replaceContextVars(
			this.replaceCliEnvVars(text)
		);
	}

	replaceCliEnvVars(text) {
		return this.replaceVarsWithTpl(
			text,
			VAR_SCOPE_ENV
		)
	}

	replaceContextVars(text) {
		return this.replaceVarsWithTpl(
			text,
			VAR_SCOPE_USER
		)
	}

	replaceVarsWithTpl(text, scope) {
		var tpl = null

		if (scope == VAR_SCOPE_CLI || scope == VAR_SCOPE_ENV)
			tpl = k => '${' + k + '}'
		if (scope == VAR_SCOPE_USER) tpl = k => '{{' + k + '}}'
		if (!tpl) throw new Error('scope unknown: ' + scope)

		for (const [key, v] of Object.entries(this.mem)) {
			if (v.scope != scope) continue
			const value = v.value
			const pattern = tpl(key)
			text = text.replaceAll(pattern, value)
		}
		return text
	}
}
