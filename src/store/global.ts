import { createPersistMiddleware } from "./middleware";

interface GlobalState {
  isCollapsed: boolean;
  onCollapsedChange: () => void;
}

const initialState: GlobalState = {
  isCollapsed: false,
  onCollapsedChange: () => {},
};

export const useGlobalStore = createPersistMiddleware<GlobalState>("CP_GLOBAL", (set) => ({
  ...initialState,
  onCollapsedChange: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
