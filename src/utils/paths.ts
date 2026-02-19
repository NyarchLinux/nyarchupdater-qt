import envPaths from "env-paths";

export const paths = envPaths("Nyarch Updater", {
    suffix: "", // no need for suffix, there will only be one nyarch updater (see https://github.com/sindresorhus/env-paths)
});
