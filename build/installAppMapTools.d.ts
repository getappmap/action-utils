export type InstallAppMapToolsOptions = {
    toolsURL?: string;
    force?: boolean;
    githubToken?: string;
};
export default function installAppMapTools(toolsPath: string, options?: InstallAppMapToolsOptions): Promise<void>;
