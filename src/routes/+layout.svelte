<script>
    import "../app.css";
    import "bootstrap-icons/font/bootstrap-icons.css";

    import Header from "../components/Header.svelte";
    import Sidebar from "../components/Sidebar.svelte";

    import {page} from '$app/stores';
    import {onMount} from "svelte";

    let is_authenticated;

    authenticated.subscribe(value => {
        is_authenticated = value;
    });

    import {goto} from "$app/navigation";

    import {authenticated} from "../stores.js";

    onMount(() => {
        if (is_authenticated) {
            goto('/');
        }else{
            goto('/authenticate');
        }
    });


</script>

<svelte:head>
    <title>خدمات دریایی سینا</title>
</svelte:head>

{#if $page.url.pathname === '/authenticate'}
    <slot></slot>
{:else if is_authenticated}
    <div class="flex flex-row bg-gray-100 h-screen">
        <Sidebar/>
        <div class="flex flex-col w-full">
            <Header/>
            <div class="pr-0 pt-12 md:pr-48">
                <slot></slot>
            </div>
        </div>
    </div>
{/if}