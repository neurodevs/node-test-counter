import { SpruceErrors } from "#spruce/errors/errors.types"
import { ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"

export interface RepoNotFoundErrorOptions extends SpruceErrors.NodeTestCounter.RepoNotFound, ISpruceErrorOptions {
	code: 'REPO_NOT_FOUND'
}

type ErrorOptions =  | RepoNotFoundErrorOptions 

export default ErrorOptions
