package graphql

import (
	"fmt"
	"strings"

	gql "github.com/sourcegraph/sourcegraph/cmd/frontend/graphqlbackend"
	store "github.com/sourcegraph/sourcegraph/enterprise/internal/codeintel/stores/dbstore"
	"github.com/sourcegraph/sourcegraph/internal/workerutil"
)

type indexStepsResolver struct {
	index store.Index
}

var _ gql.IndexStepsResolver = &indexStepsResolver{}

func (r *indexStepsResolver) Setup() []gql.ExecutionLogEntryResolver {
	return r.executionLogEntryResolversWithPrefix("setup.")
}

func (r *indexStepsResolver) PreIndex() []gql.PreIndexStepResolver {
	var resolvers []gql.PreIndexStepResolver
	for i, step := range r.index.DockerSteps {
		resolvers = append(resolvers, &preIndexStepResolver{
			step:  step,
			entry: r.findExecutionLogEntry(fmt.Sprintf("step.docker.%d", i)),
		})
	}

	return resolvers
}

func (r *indexStepsResolver) Index() gql.IndexStepResolver {
	return &indexStepResolver{
		index: r.index,
		entry: r.findExecutionLogEntry(fmt.Sprintf("step.docker.%d", len(r.index.DockerSteps)-1)),
	}
}

func (r *indexStepsResolver) Upload() gql.ExecutionLogEntryResolver {
	return newExecutionLogEntryResolver(r.findExecutionLogEntry("step.src.0"))
}

func (r *indexStepsResolver) Teardown() []gql.ExecutionLogEntryResolver {
	return r.executionLogEntryResolversWithPrefix("teardown.")
}

func (r *indexStepsResolver) findExecutionLogEntry(key string) *workerutil.ExecutionLogEntry {
	for _, entry := range r.index.ExecutionLogs {
		if entry.Key == key {
			return &entry
		}
	}

	return nil
}

func (r *indexStepsResolver) executionLogEntryResolversWithPrefix(prefix string) []gql.ExecutionLogEntryResolver {
	var resolvers []gql.ExecutionLogEntryResolver
	for _, entry := range r.index.ExecutionLogs {
		if !strings.HasPrefix(entry.Key, prefix) {
			continue
		}

		resolvers = append(resolvers, &executionLogEntryResolver{
			entry: entry,
		})
	}

	return resolvers
}
