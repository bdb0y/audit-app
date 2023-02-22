<script>

    import {authenticated, gen_token} from "../../stores.js";
    import {goto} from "$app/navigation";

    let username;
    let password;
    let is_complete = false;

    $:
        is_complete = username &&
            username.length > 0 &&
            password &&
            password.length > 0;

    let is_authenticated;

    authenticated.subscribe(value => {
        is_authenticated = value;
    });

    let on_error = false;

    async function login() {
        if (username === 'admin' && password === '*#Secret761#*') {
            authenticated.set(true);
            gen_token.set(1);
            await goto('/');
        } else {
            on_error = true;
        }
    }

</script>

<svelte:head>
    <title>خدمات دریایی سینا | ورود به سیستم</title>
</svelte:head>

<div class="flex flex-row bg-gray-100 h-screen">
    <div class="flex flex-col w-full">
        <div class="flex flex-col w-full xs:w-64 bg-white rounded-md py-8 px-2 gap-2 m-auto">
            <img src="logo.jpg"/>
            {#if on_error}
                <div class="bg-red-400 text-white text-sm p-2 text-center rounded-sm">
                    <span>خطایی رخ داده است</span>
                </div>
            {/if}
            <input bind:value={username} class="border-2 border-gray-100 rounded-md p-2" type="text"
                   placeholder="نام کاربری"/>
            <input bind:value={password} class="border-2 border-gray-100 rounded-md p-2" type="password"
                   placeholder="رمزعبور"/>
            <button on:click={() => login()}
                    disabled={!is_complete}
                    class="{is_complete ? 'bg-satcom-a':'bg-slate-600'} text-white p-2 rounded-md">ورود
            </button>
        </div>
    </div>
</div>