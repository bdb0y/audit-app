<script>

    import {onMount} from "svelte";
    import {END_POINT} from "../../../constants.js";

    let period_on_create = {
        title: '',
        fromDate: '',
        toDate: ''
    };

    let period_on_modify = {
        id: '',
        fromDate: '',
        toDate: ''
    };

    let on_new_period = false;

    let on_modify_period = false;

    async function getPeriods() {
        const req = await fetch(`${END_POINT}/api/period/get_periods`)
        const res = await req.json();

        if (req.ok) {
            console.log(res);
            return res;
        } else {
        }
    }

    let periods;

    onMount(() => {
        periods = getPeriods();
    });

    function convert_date_short(date) {
        let full_date = new Date(date.replace(/-/g, "/")).toLocaleDateString('fa-IR', {
            // weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return full_date;
    }

    function convert_date_long(date) {
        let full_date = new Date(date.replace(/-/g, "/")).toLocaleDateString('fa-IR', {
            // weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });

        return full_date;
    }

    function convert_date_en(date) {
        return moment.from(date, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    }

    import moment from 'jalali-moment';


    async function createPeriod() {
        console.log(JSON.stringify(period_on_create));

        const form_body = new FormData();
        form_body.append('title', period_on_create.title);
        form_body.append('toDate', convert_date_en(period_on_create.toDate));
        form_body.append('fromDate', convert_date_en(period_on_create.fromDate));
        form_body.append('active', true);

        const req = await fetch(`${END_POINT}/api/period/create_period`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            console.log(res);
            periods = getPeriods();
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }
    }

    import {cleave} from 'svelte-cleavejs'

    let date_format_options = {
        date: true,
        delimiter: '/',
        datePattern: ['Y', 'm', 'd']
    };

</script>

<div>
    <div class="px-2 py-2 text-gray-400 text-xs sm:text-md">
        <h1>پیمایش دوره ها</h1>
    </div>
    <div class="gap-2 md:px-2">
        <div class="bg-white">
            {#if on_new_period}
                <div class="mb-8">
                    <div class="flex flex-col py-2 px-2 gap-2">
                        <div class="px-2 flex flex-row items-center">
                            <h1 class="font-bold">اضافه کردن یک دوره جدید</h1>
                            {#if on_new_period}
                                <i on:click={() => {
                                    on_new_period = !on_new_period;
                                }}
                                   class="bi bi-dash-square flex text-xl text-red-500 hover:text-red-700 cursor-pointer mr-auto"></i>
                            {/if}
                        </div>
                        <hr/>
                        <div class="px-2 flex flex-col gap-2 text-sm">
                            <label for="selected_period_title">عنوان</label>
                            <input bind:value={period_on_create.title}
                                   id="selected_period_title"
                                   class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                   type="text" placeholder="عنوان دوره"/>
                        </div>
                        <div class="px-2 flex flex-row gap-2">
                            <div class="flex flex-col gap-2 text-sm grow">
                                <label for="selected_period_fromDate">تاریخ شروع دوره</label>
                                <input use:cleave={date_format_options} bind:value={period_on_create.fromDate}
                                       id="selected_period_fromDate"
                                       class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                       type="text" placeholder="1401/09/26"/>
                            </div>
                            <div class="flex flex-col gap-2 text-sm grow">
                                <label for="selected_period_toDate">تاریخ پایان دوره</label>
                                <input use:cleave={date_format_options} bind:value={period_on_create.toDate}
                                       id="selected_period_toDate"
                                       class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                       type="text" placeholder="1401/12/26"/>
                            </div>
                        </div>
                        <div class="px-2 mr-auto">
                            <button on:click={() => {
                                createPeriod();
                            }}
                                    class="bg-blue-500 text-white py-2 hover:bg-blue-600 rounded-sm mr-auto px-8">ثبت
                            </button>
                            <button on:click={() => {
                                on_new_period = false;
                            }}
                                    class="bg-slate-500 hover:bg-slate-600 text-white py-2 rounded-sm px-4">لغو
                            </button>
                        </div>
                    </div>
                    <hr/>
                </div>
            {/if}
            {#if on_modify_period}
                <div class="mb-8">
                    <div class="px-4 py-2 flex flex-row items-center">
                        <h1 class="font-bold">ویرایش دوره انتخاب شده</h1>
                        {#if on_new_period}
                            <i on:click={() => {
                                    on_new_period = !on_new_period;
                                }}
                               class="bi bi-dash-square flex text-xl text-red-500 hover:text-red-700 cursor-pointer mr-auto"></i>
                        {/if}
                    </div>
                    <hr/>
                    <div class="flex flex-col py-2 px-2 gap-2">
                        <div class="px-2 flex flex-col gap-2 text-sm">
                            <label for="mselected_period_title">عنوان</label>
                            <input bind:value={period_on_create.title}
                                   id="mselected_period_title"
                                   class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                   type="text" placeholder="عنوان دوره"/>
                        </div>
                        <div class="px-2 flex flex-row gap-2">
                            <div class="flex flex-col gap-2 text-sm grow">
                                <label for="mselected_period_fromDate">تاریخ شروع دوره</label>
                                <input bind:value={period_on_create.fromDate}
                                       id="mselected_period_fromDate"
                                       class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                       type="text" placeholder="1401/09/26"/>
                            </div>
                            <div class="flex flex-col gap-2 text-sm grow">
                                <label for="mselected_period_toDate">تاریخ پایان دوره</label>
                                <input bind:value={period_on_create.toDate}
                                       id="mselected_period_toDate"
                                       class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                       type="text" placeholder="1401/12/26"/>
                            </div>
                        </div>
                        <div class="px-2 mr-auto">
                            <button on:click={() => console.log()}
                                    class="bg-blue-500 text-white py-2 hover:bg-blue-600 rounded-sm mr-auto px-8">ثبت
                            </button>
                            <button on:click={() => {
                                on_modify_period = false;
                            }}
                                    class="bg-slate-500 hover:bg-slate-600 text-white py-2 rounded-sm px-4">لغو
                            </button>
                        </div>
                    </div>
                    <hr/>
                </div>
            {/if}
            <div class="px-4 py-2 flex">
                <h1 class="font-bold text-xs sm:text-md">همه ی دوره های ثبت شده</h1>
                {#if !on_new_period}
                    <i on:click={() => {
                    on_new_period = !on_new_period;
                    on_modify_period = false;
                        }}
                       class="bi bi-plus-square flex mr-auto text-xl text-blue-500 cursor-pointer hover:text-blue-700"></i>
                {/if}
            </div>
            <div class="md:p-2 overflow-auto">
                <table role="gridcell"
                       class="w-full text-sm text-left text-gray-500">
                    <thead class="text-xsm md:text-md text-center text-gray-700 uppercase bg-gray-100">
                    <tr class="">
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            عنوان دوره
                        </th>
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            تاریخ شروع دوره
                        </th>
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            تاریخ پایان دوره
                        </th>
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            تاریخ ایجاد
                        </th>
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            وضعیت
                        </th>
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            عملیات
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {#await periods}

                    {:then result}
                        {#if result}
                            {#each Array.from(result) as period}
                                <tr
                                        class="hover:cursor-pointer even:bg-gray-50 text-center bg-white hover:bg-gray-50 ">
                                    <td scope="row"
                                        class="py-6 px-6 whitespace-nowrap font-medium text-gray-900 ">
                                        {period.title}
                                    </td>
                                    <td scope="row"
                                        class="py-6 px-6 whitespace-nowrap font-medium text-gray-900 ">
                                        {convert_date_short(period.fromDate)}
                                    </td>
                                    <td class="py-6 px-6 whitespace-nowrap flex justify-center">
                                        {convert_date_short(period.toDate)}
                                    </td>
                                    <td class="py-6 px-6 whitespace-nowrap">
                                        {convert_date_long(period.timestamp)}
                                    </td>
                                    <td class="py-6 px-6">
                                        <div class="flex text-white justify-center">
                                            <div class="grow-0 {period.active ? 'bg-green-600':'bg-red-600'} px-2 py-[4px] rounded-sm text-xs">{period.active ? 'فعال' : 'غیرفعال'}</div>
                                        </div>
                                    </td>
                                    <td class="py-6 px-6 whitespace-nowrap">
                                        <div class="flex flex-row gap-2 items-center justify-center text-md">
                                            <i on:click={() => {
                                    //on_modify_period = !on_modify_period;
                                    //on_new_period = false;
                                }}
                                               class="bi bi-pencil-square flex bg-yellow-600 text-white p-[3px] rounded-sm"></i>
                                            <i class="bi bi-lightbulb-off flex bg-black text-white p-[3px] rounded-sm"></i>
                                            <i class="bi bi-trash flex text-md bg-red-600 text-white p-[3px] rounded-sm"></i>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    {/await}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

