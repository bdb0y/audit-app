<script>

    import {END_POINT} from "../../../constants.js";
    import {onMount} from "svelte";

    let topic_on_create = {
        title: '',
        description: '',
        period: ''
    };

    let topic_on_modify = {
        id: '',
        description: '',
        period: ''
    };

    let on_new_topic = false;

    let on_modify_topic = false;

    async function getTopics() {
        const req = await fetch(`${END_POINT}/api/topic/get_period_topics`)
        const res = await req.json();

        if (req.ok) {
            console.log(res);
            return res;
        } else {
        }
    }

    let topics;

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

    onMount(async () => {
        topics = getTopics();
        periods = await getPeriods();
    });

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


    async function createTopic() {
        console.log(JSON.stringify(topic_on_create));

        const form_body = new FormData();
        form_body.append('title', topic_on_create.title);
        form_body.append('description', topic_on_create.description);
        form_body.append('period', topic_on_create.period);
        form_body.append('active', true);

        const req = await fetch(`${END_POINT}/api/topic/create_topic`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            console.log(res);
            topics = getTopics();
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }

        topic_on_create = {
            title: '',
            description: '',
            period: ''
        };
    }

</script>

<div>
    <div class="px-2 py-2 text-gray-400 text-xs sm:text-md">
        <h1>پیمایش موضوع ها</h1>
    </div>
    <div class="gap-2 md:px-2">
        <div class="bg-white">
            {#if on_new_topic}
                <div class="mb-8">
                    <div class="flex flex-col py-2 px-2 gap-2">
                        <div class="px-2 flex flex-row items-center">
                            <h1 class="font-bold">اضافه کردن یک موضوع جدید</h1>
                            {#if on_new_topic}
                                <i on:click={() => {
                                    on_new_topic = !on_new_topic;
                                }}
                                   class="bi bi-dash-square flex text-xl text-red-500 hover:text-red-700 cursor-pointer mr-auto"></i>
                            {/if}
                        </div>
                        <hr/>
                        <div class="px-2 flex flex-col gap-2 text-sm">
                            <label for="selected_topic_title">عنوان</label>
                            <input bind:value={topic_on_create.title}
                                   id="selected_topic_title"
                                   class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                   type="text" placeholder="عنوان موضوع"/>
                        </div>
                        <div class="px-2 flex flex-col gap-2 text-sm grow">
                            <label for="selected_topic_description">توضیحات موضوع</label>
                            <textarea bind:value={topic_on_create.description}
                                      id="selected_topic_description"
                                      class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                      type="text" placeholder="توضیحات"></textarea>
                        </div>
                        <div class="px-2 flex flex-col gap-2 text-sm grow">
                            <label for="selected_topic_period">دوره ی فعال</label>
                            <!--                            <input bind:value={topic_on_create.period}-->
                            <!--                                   id="selected_topic_period"-->
                            <!--                                   class="border-2 border-gray-100 py-2 px-2 rounded-sm"-->
                            <!--                                   type="text" placeholder="1401/12/26"/>-->
                            <select class="border-2 border-gray-100"
                                    id="selected_topic_period" bind:value={topic_on_create.period}>
                                {#if periods}
                                    {#each periods as period}
                                        <option value="{period.id}">{period.title}</option>
                                    {/each}
                                {/if}
                            </select>
                        </div>
                        <div class="px-2 mr-auto">
                            <button on:click={() => createTopic()}
                                    class="bg-blue-500 text-white py-2 hover:bg-blue-600 rounded-sm mr-auto px-8">ثبت
                            </button>
                            <button on:click={() => {
                                on_new_topic = false;
                            }}
                                    class="bg-slate-500 hover:bg-slate-600 text-white py-2 rounded-sm px-4">لغو
                            </button>
                        </div>
                    </div>
                    <hr/>
                </div>
            {/if}
            {#if on_modify_topic}
                <div class="mb-8">
                    <div class="px-4 py-2 flex flex-row items-center">
                        <h1 class="font-bold">ویرایش عنوان انتخاب شده</h1>
                        {#if on_new_topic}
                            <i on:click={() => {
                                    on_new_topic = !on_new_topic;
                                }}
                               class="bi bi-dash-square flex text-xl text-red-500 hover:text-red-700 cursor-pointer mr-auto"></i>
                        {/if}
                    </div>
                    <hr/>
                    <div class="flex flex-col py-2 px-2 gap-2">
                        <div class="px-2 flex flex-col gap-2 text-sm">
                            <label for="mselected_topic_title">عنوان</label>
                            <input bind:value={topic_on_create.title}
                                   id="mselected_topic_title"
                                   class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                   type="text" placeholder="عنوان موضوع"/>
                        </div>
                        <div class="px-2 flex flex-col gap-2 text-sm grow">
                            <label for="mselected_topic_description">توضیحات موضوع</label>
                            <textarea bind:value={topic_on_create.description}
                                      id="mselected_topic_description"
                                      class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                      type="text" placeholder="توضیحات"></textarea>
                        </div>
                        <div class="px-2 flex flex-col gap-2 text-sm grow">
                            <label for="mselected_topic_period">دوره ی فعال</label>
                            <input bind:value={topic_on_create.period}
                                   id="mselected_topic_period"
                                   class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                   type="text" placeholder="1401/12/26"/>
                        </div>
                        <div class="px-2 mr-auto">
                            <button on:click={() => console.log()}
                                    class="bg-blue-500 text-white py-2 hover:bg-blue-600 rounded-sm mr-auto px-8">ثبت
                            </button>
                            <button on:click={() => {
                                on_modify_topic = false;
                            }}
                                    class="bg-slate-500 hover:bg-slate-600 text-white py-2 rounded-sm px-4">لغو
                            </button>
                        </div>
                    </div>
                    <hr/>
                </div>
            {/if}
            <div class="px-4 py-2 flex">
                <h1 class="font-bold text-xs sm:text-md">همه ی موضوع های ثبت شده</h1>
                {#if !on_new_topic}
                    <i on:click={() => {
                    on_new_topic = !on_new_topic;
                    on_modify_topic = false;
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
                            عنوان موضوع
                        </th>
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            توضیحات موضوع
                        </th>
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            دوره ی فعال
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
                    {#await topics}

                    {:then result}
                        {#if result}
                            {#each Array.from(result) as topic}
                                <tr
                                        class="hover:cursor-pointer even:bg-gray-50 text-center bg-white hover:bg-gray-50 ">
                                    <td scope="row"
                                        class="py-6 px-6 whitespace-nowrap font-medium text-gray-900 ">
                                        {topic.title}
                                    </td>
                                    <td class="py-6 px-6 whitespace-nowrap flex justify-center">
                                        {topic.description.length > 30 ? topic.description.substring(0, 30) : topic.description}
                                    </td>
                                    <td class="py-6 px-6 whitespace-nowrap">
                                        {topic.period}
                                    </td>
                                    <td class="py-6 px-6 whitespace-nowrap">
                                        {convert_date_long(topic.timestamp)}
                                    </td>
                                    <td class="py-6 px-6">
                                        <div class="flex text-white justify-center">
                                            <div class="grow-0 {topic.active ? 'bg-green-600':'bg-red-600'} px-2 py-[4px] rounded-sm text-xs">{topic.active ? 'فعال' : 'غیرفعال'}</div>
                                        </div>
                                    </td>
                                    <td class="py-6 px-6 whitespace-nowrap">
                                        <div class="flex flex-row gap-2 items-center justify-center text-md">
                                            <i on:click={() => {
                                    // on_modify_topic = !on_modify_topic;
                                    // on_new_topic = false;
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