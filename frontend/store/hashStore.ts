import { create } from "zustand";

type State = {
    hash: string;
    image_url: string;
};

type Action = {
    updateHash: (hash: string) => void;
    updateImageUrl: (image_url: string) => void;
};

export const usePromptHash = create<State & Action>((set) => ({
    hash: "",
    updateHash: (hash) => set({ hash }),
    image_url: "",
    updateImageUrl: (image_url) => set({ image_url }),
}));
