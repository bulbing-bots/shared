import { Tool_Output_Format_JsonMD } from "../../../config/consts"
import ToolResult from "../../../data/tool-result"
import { mdBlockJson, mdTextBlock, toJson } from "../../../utils/utils"


export default class AITool {

	constructor(ctx, config) {
		this.ctx = ctx
		this.config = config
	}

	/**
	 * return a text for a response formatted in markdown json
	 * @param {Object} obj
	 */
	jsonMDResult(obj) {
		return new ToolResult(mdBlockJson(toJson(obj)))	// /!\ reintroduce formating json output
	}

	/**
	 * returns as a plain text json result
	 * @param {Object} obj
	 * @returns {ToolResult}
	 */
	jsonPlainResult(obj) {
		return new ToolResult(toJson(obj))	// /!\ reintroduce formating json output
	}

	/**
	 * returns as a json result
	 * @param {Object} obj
	 * @returns {ToolResult}
	 */
	jsonResult(obj) {
		return this.config.tool_output_preferred_format ==
			Tool_Output_Format_JsonMD ? this.jsonMDResult(obj)
			: this.jsonPlainResult(obj)
	}

	/**
	 * returns as md text block result
	 * @param {String} text
	 * @returns {ToolResult}
	 */
	textMDResult(text) {
		return new ToolResult(mdTextBlock(text))
	}

	/**
	 * returns as md text block result
	 * @param {String} text
	 * @returns {ToolResult}
	 */
	textResult(text) {
		return new ToolResult(text)
	}
}
