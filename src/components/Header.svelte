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




    import {
        is_sidebar_open,
        sso_workPlaceSlug,
        gen_token,
        sso_departmentName,
        sso_firstName,
        sso_lastName,
        sso_workPlaceName
    } from "../stores.js";

    let sidebar_opened;

    is_sidebar_open.subscribe(value => {
        sidebar_opened = value;
    })

    let the_token;
    let firstName;
    let lastName;
    let departmentName;
    let workPlaceSlug;
    let workPlaceName;

    gen_token.subscribe(value => {
        the_token = value;
    });

    sso_firstName.subscribe(value => {
        firstName = value;
    });

    sso_lastName.subscribe(value => {
        lastName = value;
    });

    sso_departmentName.subscribe(value => {
        departmentName = value;
    });

    sso_workPlaceSlug.subscribe(value => {
        workPlaceSlug = value;
    });

    sso_workPlaceName.subscribe(value => {
        workPlaceName = value;
    });

</script>

<div style="background-color: #3C8DBC"
     class="flex flex-row items-center px-2 py-2 sm:py-4 sm:px-4 w-full h-12 fixed shadow-md z-20">
    <i on:click={() => is_sidebar_open.set(!sidebar_opened)}
       class="bi bi-list flex text-2xl text-white"></i>
    <div class="mr-auto flex flex-row gap-2 sm:gap-4 text-white text-xs items-center">
        <div class="hidden sm:block">
            <span style="">{convert_date()}</span>
        </div>
        <div>
            {firstName + ' ' + lastName} | {workPlaceSlug === 'wJCPQ8MALTlDMoYFS4Gt' ? departmentName : workPlaceName}
        </div>
    </div>
</div>