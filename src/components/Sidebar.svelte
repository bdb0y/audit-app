<script>

    import {goto} from "$app/navigation";

    import {is_sidebar_open} from "../stores.js";

    let sidebar_opened;

    is_sidebar_open.subscribe(value => {
        sidebar_opened = value;
    });

    let is_settings_opened = false;

</script>

<div class="{sidebar_opened ? 'block w-full':'hidden w-48'} md:block fixed bg-slate-700 h-screen z-10">
    <div class="h-12 px-4 py-2 flex flex-row justify-center bg-blue-600 items-center">
        <h1 class="whitespace-nowrap font-bold text-white text-center">خدمات دریایی سینا</h1>
        <i on:click={() => is_sidebar_open.set(false)}
           class="{sidebar_opened ? 'block':'hidden'} bi bi-x flex text-3xl mr-auto text-white"></i>
    </div>
    <div class="text-white">
        <ul>

            <li on:click={() => {
                goto('/', {replaceState: false});
                is_sidebar_open.set(false);
            }}
                class="px-4 flex flex-row items-center py-3 gap-2 text-sm hover:bg-blue-400 cursor-pointer">
                <i class="bi bi-text-right flex text-lg"></i>
                مدیریت موضوعات
            </li>
            <li class="flex flex-col text-sm  cursor-pointer">
                <div on:click={() => {
                    is_settings_opened = !is_settings_opened;
                }}
                        class="px-4 py-3 flex flex-row gap-2 items-center hover:bg-blue-400">
                    <i class="bi bi-gear flex text-lg"></i>
                    تنظیمات
                    <i class="bi bi-chevron-{is_settings_opened ? 'down':'left'} flex text-sm mr-auto"></i>
                </div>
                {#if is_settings_opened}
                    <ul class="pr-4 text-slate-400 text-xs">
                        <li on:click={() => {
                            goto('/settings/periods', {replaceState: false});
                            is_sidebar_open.set(false);
                        }}
                                class="py-2 flex items-center gap-2 hover:text-slate-300">
                            <i class="bi bi-bullseye flex text-lg"></i>
                            پیمایش دوره ها
                        </li>
                        <li on:click={() => {
                            goto('/settings/topics', {replaceState: false});
                            is_sidebar_open.set(false);
                        }}
                                class="py-2 flex items-center gap-2 hover:text-slate-300">
                            <i class="bi bi-bullseye flex text-lg"></i>
                            پیمایش موضوعات
                        </li>
                    </ul>
                {/if}
            </li>
        </ul>
    </div>
</div>