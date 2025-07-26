import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'repoNotFound',
    name: 'REPO_NOT_FOUND',
    fields: {
        repoPath: {
            type: 'text',
            isRequired: true,
        },
    },
})
