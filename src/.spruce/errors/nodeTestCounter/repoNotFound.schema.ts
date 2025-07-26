import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const repoNotFoundSchema: SpruceErrors.NodeTestCounter.RepoNotFoundSchema  = {
	id: 'repoNotFound',
	namespace: 'NodeTestCounter',
	name: 'REPO_NOT_FOUND',
	    fields: {
	            /** . */
	            'repoPath': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(repoNotFoundSchema)

export default repoNotFoundSchema
