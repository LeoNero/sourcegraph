package gitlab

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/pkg/errors"
)

// GetMergeRequestResourceStateEvents retrieves the notes for the given merge request. As the
// notes are paginated, a function is returned that may be invoked to return the
// next page of results. An empty slice and a nil error indicates that all pages
// have been returned.
func (c *Client) GetMergeRequestResourceStateEvents(ctx context.Context, project *Project, iid ID) func() ([]*ResourceStateEvent, error) {
	// if MockGetMergeRequestNotes != nil {
	// 	return MockGetMergeRequestNotes(c, ctx, project, iid)
	// }

	url := fmt.Sprintf("projects/%d/merge_requests/%d/resource_state_events", project.ID, iid)
	return func() ([]*ResourceStateEvent, error) {
		page := []*ResourceStateEvent{}

		// If there aren't any further pages, we'll return the empty slice we
		// just created.
		if url == "" {
			return page, nil
		}

		time.Sleep(c.rateLimitMonitor.RecommendedWaitForBackgroundOp(1))

		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			return nil, errors.Wrap(err, "creating rse request")
		}

		header, _, err := c.do(ctx, req, &page)
		if err != nil {
			if errors.Is(err, HTTPError(404)) {
				return []*ResourceStateEvent{}, nil
			}
			return nil, errors.Wrap(err, "requesting rse page")
		}

		// If there's another page, this will be a URL. If there's not, then
		// this will be an empty string, and we can detect that next iteration
		// to short circuit.
		url = header.Get("X-Next-Page")

		return page, nil
	}
}

// ResourceStateEventState is a type of all known resource state event states.
type ResourceStateEventState string

const (
	ResourceStateEventStateClosed   ResourceStateEventState = "closed"
	ResourceStateEventStateReopened ResourceStateEventState = "reopened"
	ResourceStateEventStateMerged   ResourceStateEventState = "merged"
)

type ResourceStateEvent struct {
	ID           ID                      `json:"id"`
	User         User                    `json:"user"`
	CreatedAt    Time                    `json:"created_at"`
	ResourceType string                  `json:"resource_type"`
	ResourceID   int64                   `json:"resource_id"`
	State        ResourceStateEventState `json:"state"`
}

// Notes are not strongly typed, but also provide the only real method we have
// of getting historical approval events. We'll define a couple of fake types to
// better match what other external services provide, and a function to convert
// a Note into one of those types if the Note is a system approval comment.

type MergeRequestClosedEvent struct{ *ResourceStateEvent }

func (e *MergeRequestClosedEvent) Key() string {
	return fmt.Sprintf("closed:%s", e.CreatedAt.Time)
}

type MergeRequestReopenedEvent struct{ *ResourceStateEvent }

func (e *MergeRequestReopenedEvent) Key() string {
	return fmt.Sprintf("reopened:%s", e.CreatedAt.Time)
}

type MergeRequestMergedEvent struct{ *ResourceStateEvent }

func (e *MergeRequestMergedEvent) Key() string {
	return fmt.Sprintf("merged:%s", e.CreatedAt.Time)
}

// ToEvent returns a pointer to a more specific struct, or
// nil if the Note is not of a known kind.
func (rse *ResourceStateEvent) ToEvent() interface{} {
	switch rse.State {
	case ResourceStateEventStateClosed:
		return &MergeRequestClosedEvent{rse}
	case ResourceStateEventStateReopened:
		return &MergeRequestReopenedEvent{rse}
	case ResourceStateEventStateMerged:
		return &MergeRequestMergedEvent{rse}
	}
	return nil
}
