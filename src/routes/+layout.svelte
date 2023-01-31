<script>
    import "../app.css";
    import "bootstrap-icons/font/bootstrap-icons.css";

    import Header from "../components/Header.svelte";
    import Sidebar from "../components/Sidebar.svelte";
</script>

<div class="flex flex-row bg-gray-100 h-screen">
    <Sidebar/>
    <div class="flex flex-col w-full">
        <Header/>
        <div class="pr-0 pt-12 md:pr-48">
            <slot></slot>
        </div>
    </div>
</div>