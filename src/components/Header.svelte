<script>
    function convert_date(date) {
        let full_date = new Date().toLocaleDateString('fa-IR', {
            // weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        console.log(date);

        return full_date;
    }

    import {is_sidebar_open} from "../stores.js";

    let sidebar_opened;

    is_sidebar_open.subscribe(value => {
        sidebar_opened = value;
    })
</script>

<div class="bg-blue-500 flex flex-row items-center px-2 py-2 sm:py-4 sm:px-4 w-full h-12 fixed shadow-md">
    <i on:click={() => is_sidebar_open.set(!sidebar_opened)}
       class="bi bi-list flex text-2xl text-white"></i>
    <div class="mr-auto flex flex-row gap-2 sm:gap-4 text-white text-xs items-center">
        <div class="hidden sm:block">
            <span style="">{convert_date()}</span>
        </div>
        <div>
            احسان اسدی | مدیریت فناوری اطلاعات و ارتباطات
        </div>
    </div>
</div>