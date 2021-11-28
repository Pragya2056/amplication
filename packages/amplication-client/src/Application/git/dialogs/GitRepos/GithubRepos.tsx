import { NetworkStatus } from "@apollo/client";
import { CircularProgress } from "@rmwc/circular-progress";
import { Snackbar } from "@rmwc/snackbar";
import React, { useCallback } from "react";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import { EnumSourceControlService } from "../../../../models";
import { formatError } from "../../../../util/error";
import useGetReposOfUser from "../../hooks/useGetReposOfUser";
import useGitSelected from "../../hooks/useGitSelected";
import GitRepoItem from "./GitRepoItem/GitRepoItem";
import "./GitRepos.scss";

const CLASS_NAME = "git-repos";

type Props = {
  applicationId: string;
  onCompleted: () => void;
  sourceControlService: EnumSourceControlService;
};

function GitRepos({ applicationId, onCompleted, sourceControlService }: Props) {
  const {
    refetch,
    error,
    repos,
    loading: loadingRepos,
    networkStatus,
  } = useGetReposOfUser({
    appId: applicationId,
    sourceControlService,
  });

  const { handleRepoSelected, error: errorUpdate } = useGitSelected({
    appId: applicationId,
    onCompleted,
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const errorMessage = formatError(error || errorUpdate);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`}>
        <h4>
          Select a {sourceControlService} repository to sync your application
          with.
        </h4>
        {(loadingRepos || networkStatus === NetworkStatus.refetch) && (
          <CircularProgress />
        )}
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          onClick={(e) => {
            handleRefresh();
          }}
          type="button"
          icon="refresh_cw"
          disabled={networkStatus === NetworkStatus.refetch}
        />
      </div>
      {repos?.map((repo) => (
        <GitRepoItem
          key={repo.fullName}
          repo={repo}
          onSelectRepo={handleRepoSelected}
        />
      ))}
      <Snackbar open={Boolean(error || errorUpdate)} message={errorMessage} />
    </div>
  );
}

export default GitRepos;
