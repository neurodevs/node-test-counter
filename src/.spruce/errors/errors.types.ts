import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'





export declare namespace SpruceErrors.NodeTestCounter {

	
	export interface RepoNotFound {
		
			
			'repoPath': string
	}

	export interface RepoNotFoundSchema extends SpruceSchema.Schema {
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

	export type RepoNotFoundEntity = SchemaEntity<SpruceErrors.NodeTestCounter.RepoNotFoundSchema>

}




