import { gql } from '../../../../../shared/src/graphql/graphql'

export const lsifUploadFieldsFragment = gql`
    fragment LsifUploadFields on LSIFUpload {
        __typename
        id
        inputCommit
        inputRoot
        inputIndexer
        projectRoot {
            url
            path
            repository {
                url
                name
            }
            commit {
                url
                oid
                abbreviatedOID
            }
        }
        state
        failure
        isLatestForRepo
        uploadedAt
        startedAt
        finishedAt
        placeInQueue
    }
`

export const lsifIndexFieldsFragment = gql`
    fragment LsifIndexFields on LSIFIndex {
        __typename
        id
        inputCommit
        inputRoot
        inputIndexer
        projectRoot {
            url
            path
            repository {
                url
                name
            }
            commit {
                url
                oid
                abbreviatedOID
            }
        }
        steps {
            ...LsifIndexStepsFields
        }
        state
        failure
        queuedAt
        startedAt
        finishedAt
        placeInQueue
    }
`

export const indexStepsFieldsFragment = gql`
    fragment LsifIndexStepsFields on IndexSteps {
        setup {
            key
            command
            startTime
            exitCode
            out
            durationMilliseconds
            # ...ExecutionLogEntryFields
        }
        preIndex {
            root
            image
            commands
            logEntry {
                key
                command
                startTime
                exitCode
                out
                durationMilliseconds
                # ...ExecutionLogEntryFields
            }
        }
        index {
            indexerArgs
            outfile
            logEntry {
                key
                command
                startTime
                exitCode
                out
                durationMilliseconds
                # ...ExecutionLogEntryFields
            }
        }
        upload {
            key
            command
            startTime
            exitCode
            out
            durationMilliseconds
            # ...ExecutionLogEntryFields
        }
        teardown {
            key
            command
            startTime
            exitCode
            out
            durationMilliseconds
            # ...ExecutionLogEntryFields
        }
    }
`

// export const executionLogEntryFieldsFragment = gql`
//     fragment ExecutionLogEntryFields on ExecutionLogEntry {
//         key
//         command
//         startTime
//         exitCode
//         out
//         durationMilliseconds
//     }
// `
