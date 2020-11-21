package graphql

import (
	"context"
	"time"

	"github.com/inconshreveable/log15"
	"github.com/sourcegraph/sourcegraph/cmd/frontend/backend"
	gql "github.com/sourcegraph/sourcegraph/cmd/frontend/graphqlbackend"
	"github.com/sourcegraph/sourcegraph/internal/workerutil"
)

type executionLogEntryResolver struct {
	entry workerutil.ExecutionLogEntry
}

var _ gql.ExecutionLogEntryResolver = &executionLogEntryResolver{}

func newExecutionLogEntryResolver(entry *workerutil.ExecutionLogEntry) *executionLogEntryResolver {
	if entry == nil {
		return nil
	}

	return &executionLogEntryResolver{
		entry: *entry,
	}
}

func (r *executionLogEntryResolver) Key() string {
	if r == nil {
		// TODO
		log15.Warn("THIS SHOULDN'T BE HAPPENING!!!!!")
		return ""
	}

	return r.entry.Key
}

func (r *executionLogEntryResolver) Command() []string {
	if r == nil {
		// TODO
		log15.Warn("THIS SHOULDN'T BE HAPPENING!!!!!")
		return nil
	}

	return r.entry.Command
}

func (r *executionLogEntryResolver) ExitCode() int32 {
	if r == nil {
		// TODO
		log15.Warn("THIS SHOULDN'T BE HAPPENING!!!!!")
		return 0
	}

	return int32(r.entry.ExitCode)
}

func (r *executionLogEntryResolver) StartTime() gql.DateTime {
	if r == nil {
		// TODO
		log15.Warn("THIS SHOULDN'T BE HAPPENING!!!!!")
		return gql.DateTime{Time: time.Now()}
	}

	return gql.DateTime{Time: r.entry.StartTime}
}

func (r *executionLogEntryResolver) DurationMilliseconds() int32 {
	if r == nil {
		// TODO
		log15.Warn("THIS SHOULDN'T BE HAPPENING!!!!!")
		return 0
	}

	return int32(r.entry.Duration.Milliseconds())
}

func (r *executionLogEntryResolver) Out(ctx context.Context) (string, error) {
	if r == nil {
		// TODO
		log15.Warn("THIS SHOULDN'T BE HAPPENING!!!!!")
		return "", nil
	}

	// 🚨 SECURITY: Only site admins can view executor log contents.
	if err := backend.CheckCurrentUserIsSiteAdmin(ctx); err != nil {
		if err != backend.ErrMustBeSiteAdmin {
			return "", err
		}

		return "", nil
	}

	return r.entry.Out, nil
}
