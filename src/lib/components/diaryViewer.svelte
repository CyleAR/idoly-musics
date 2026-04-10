<script lang="ts">
    import { tick } from 'svelte';

    export let images: string[] = [];
    export let isOpen: boolean = false;

    let currentIndex = 0;
    
    // --- 💡 새로 추가된 로딩 상태 변수 ---
    let isLoading = true;

    let isEditingPage = false;
    let inputPage = 1;
    let inputElement: HTMLInputElement;

    // 페이지가 바뀔 때마다 로딩 상태를 다시 true로 초기화
    $: if (currentIndex !== undefined) {
        isLoading = true;
    }

    function next() {
        if (currentIndex < images.length - 1) currentIndex++;
    }

    function prev() {
        if (currentIndex > 0) currentIndex--;
    }

    function close() {
        isOpen = false;
        currentIndex = 0; 
        isEditingPage = false;
    }

    // 다음 이미지 미리 로드 (기존과 동일)
    $: if (isOpen && currentIndex < images.length - 1 && typeof window !== 'undefined') {
        const img = new Image();
        img.src = images[currentIndex + 1];
    }
    
    function handleKeydown(event: KeyboardEvent) {
        if (!isOpen || isEditingPage) return; 
        if (event.key === 'ArrowRight') next();
        if (event.key === 'ArrowLeft') prev();
        if (event.key === 'Escape') close();
    }

    async function startEditing() {
        isEditingPage = true;
        inputPage = currentIndex + 1;
        await tick(); 
        inputElement?.focus(); 
    }

    function submitPage() {
        let newIndex = inputPage - 1;
        if (newIndex >= 0 && newIndex < images.length) {
            currentIndex = newIndex;
        } else {
            inputPage = currentIndex + 1;
        }
        isEditingPage = false;
    }

    function handleInputKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') submitPage();
        if (event.key === 'Escape') isEditingPage = false;
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
    <div 
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        on:click|self={close}
    >
        <button 
            on:click={close} 
            class="absolute right-6 top-6 text-4xl text-white transition-colors hover:text-gray-300"
        >
            &times;
        </button>

        <div class="relative flex w-full max-w-5xl flex-1 items-center justify-center overflow-hidden">
            
            {#if isLoading}
                <div class="absolute text-xl font-bold text-white/50 animate-pulse select-none">
                    Loading...
                </div>
            {/if}

            {#if images.length > 0}
                <img 
                    src={images[currentIndex]} 
                    alt="Page {currentIndex + 1}" 
                    on:load={() => isLoading = false}
                    class="max-h-full max-w-full select-none object-contain shadow-2xl transition-opacity duration-200" 
                    class:opacity-0={isLoading}
                    class:opacity-100={!isLoading}
                />
            {/if}
        </div>

        <div class="mt-6 flex items-center gap-6 rounded-full bg-gray-900/80 px-6 py-3 text-lg text-white">
            <button
                on:click={prev}
                disabled={currentIndex === 0}
                class="px-4 py-2 transition-colors hover:text-pink-400 disabled:opacity-30 disabled:hover:text-white"
            >
                ◀
            </button>
            
            <div class="flex min-w-[7rem] items-center justify-center font-medium">
                {#if isEditingPage}
                    <input 
                        type="number" 
                        bind:value={inputPage}
                        bind:this={inputElement}
                        on:blur={submitPage}
                        on:keydown={handleInputKeydown}
                        class="w-16 rounded bg-gray-700 px-1 text-center text-white outline-none focus:ring-2 focus:ring-pink-500"
                        min="1" max={images.length}
                    />
                {:else}
                    <button 
                        type="button"
                        on:click={startEditing} 
                        class="cursor-pointer px-2 hover:text-pink-400 hover:underline bg-transparent border-none p-0 outline-none"
                        title="클릭하여 페이지 이동"
                    >
                        {currentIndex + 1}
                    </button>
                {/if}
                <span class="ml-2">/ {images.length}</span>
            </div>
            
            <button
                on:click={next}
                disabled={currentIndex === images.length - 1}
                class="px-4 py-2 transition-colors hover:text-pink-400 disabled:opacity-30 disabled:hover:text-white"
            >
                ▶
            </button>
        </div>
    </div>
{/if}

<style>
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type="number"] {
        -moz-appearance: textfield; 
    }
</style>