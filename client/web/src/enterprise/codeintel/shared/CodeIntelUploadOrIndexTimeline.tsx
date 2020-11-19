import CheckIcon from 'mdi-react/CheckIcon'
import ErrorIcon from 'mdi-react/ErrorIcon'
import FileUploadIcon from 'mdi-react/FileUploadIcon'
import ProgressClockIcon from 'mdi-react/ProgressClockIcon'
import TimerSandIcon from 'mdi-react/TimerSandIcon'
import React, { FunctionComponent } from 'react'
import { Timeline } from '../../../components/Timeline'
import { LsifIndexFields, LSIFIndexState, LsifUploadFields, LSIFUploadState } from '../../../graphql-operations'

export interface TimelineNode {
    state?: LsifIndexFields['state'] | LsifUploadFields['state']
    queuedAt?: string | null
    uploadedAt?: string | null
    startedAt?: string | null
    finishedAt?: string | null
}

const isCompleted = (node: TimelineNode): boolean =>
    node.state === LSIFUploadState.COMPLETED || node.state === LSIFIndexState.COMPLETED

export interface CodeIntelUploadOrIndexTimelineProps {
    node: TimelineNode
    now?: () => Date
    className?: string
}

export const CodeIntelUploadOrIndexTimeline: FunctionComponent<CodeIntelUploadOrIndexTimelineProps> = ({
    node,
    now,
    className,
}) => (
    <Timeline
        stages={[
            { icon: <FileUploadIcon />, text: 'Uploaded', date: node.uploadedAt, className: 'success' },
            { icon: <TimerSandIcon />, text: 'Queued', date: node.queuedAt, className: 'success' },
            { icon: <ProgressClockIcon />, text: 'Began processing', date: node.startedAt, className: 'success' },
            {
                icon: isCompleted(node) ? <CheckIcon /> : <ErrorIcon />,
                text: isCompleted(node) ? 'Finished' : 'Failed',
                date: node.finishedAt,
                className: isCompleted(node) ? 'success' : 'failure',
            },
        ]}
        now={now}
        className={className}
    />
)
