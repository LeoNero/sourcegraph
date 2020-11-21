package graphql

import (
	"fmt"

	gql "github.com/sourcegraph/sourcegraph/cmd/frontend/graphqlbackend"
	store "github.com/sourcegraph/sourcegraph/enterprise/internal/codeintel/stores/dbstore"
	"github.com/sourcegraph/sourcegraph/internal/workerutil"
)

type indexStepResolver struct {
	index store.Index
	entry *workerutil.ExecutionLogEntry
}

var _ gql.IndexStepResolver = &indexStepResolver{}

func (r *indexStepResolver) IndexerArgs() []string { return r.index.IndexerArgs }
func (r *indexStepResolver) Outfile() *string      { return strPtr(r.index.Outfile) }

func (r *indexStepResolver) LogEntry() gql.ExecutionLogEntryResolver {
	rx := newExecutionLogEntryResolver(r.entry)
	fmt.Printf("> indexStepResolver: %v\n", rx)
	return rx
}
