function Table(id, options) {
    this.table = $("#" + id);
    this.tbody = this.table.find('tbody');
    this.tpagins = [];
    this.tactive;

    this.maxPages;
    this.forPage = 10;
    this.currentPage;
    this.currentRow;

    this.currentSortableId = null;
    this.currentSortableBool = null;
    this.currentSortableHeader = null;


    this.data = {
        current: []
    };

    this.searched = null;



    this.createSortable = dom => {
        var data = dom.data('field');
      
        if (data == options.defaultSort) {
            dom.addClass('down');
            this.currentSortableId = data;
            this.currentSortableHeader = dom;
            this.currentSortableBool = false;
        }

        dom.append($(`
        <div class="arrows">
            <i class="chevron up icon"></i>
            <i class="chevron down icon"></i>
        </div>`));
        dom.click(e => {
            if (this.currentSortableId == data) {
                this.currentSortableBool = !this.currentSortableBool;
                this.sortBy(data, this.currentSortableBool);

                this.currentSortableHeader.removeClass('up down');

                if (this.currentSortableBool)
                    this.currentSortableHeader.addClass('up');
                else
                    this.currentSortableHeader.addClass('down');


            } else {
                if (this.currentSortableHeader) {
                    this.currentSortableHeader.removeClass('up down');
                }

                this.currentSortableHeader = dom;
                this.currentSortableHeader.addClass('down');
                this.currentSortableId = data;
                this.currentSortableBool = false;

                this.sortBy(data, false);
            }
        });
    }

    

    this.forceDelete = () => {
        this.searched = null;
        this.data.current = [];
        this.forPage = 10;     
        this.forceClearSortable();
    }
      

    this.forceClearSortable = () => {
        this.currentSortableHeader.removeClass('up down');        
        this.currentSortableId = options.defaultSort;
        this.currentSortableBool = false;
        this.currentSortableHeader = $(`.ui.table thead th[data-field="${options.defaultSort}"]`);
        this.currentSortableHeader.addClass('down');
    }

    this.forceLoad = data => {
        this.searched = null;
        this.data.current = [];
        this.forPage = 10;
        this.loadData(data);
        this.pagination(1);
    }

    this.forceRow = row => {
        this.data.current.unshift(row);
        this.sortBy(options.defaultSort);
        this.forceLoad(this.data.current);
    }

    this.forceChange = (i,data) => {
        this.data.current[i] = data;
        this.sortBy(options.defaultSort);
        this.forceLoad(this.data.current);
    }

    this.redraw = () => this.pagination(this.currentPage);


    this.changeFor = value => {
        this.forPage = parseInt(value);
        this.recalculatePages();

        this.displayPage(this.currentPage, this.searched ? this.searched : this.data.current);
        $(options.input.to).val(this.currentPage);
    }

    this.loadData = data => {         
        this.data.current = data;
        this.recalculatePages();
    }

    this.recalculatePages = () => {
        var total = this.searched ? this.searched.length : this.data.current.length;

        this.maxPages = Math.ceil(total / this.forPage);

        if (this.currentPage > this.maxPage)
            this.currentPage = this.maxPage;
    }

    this.displayPage = (page, preset = this.data.current) => {        
        if (page > this.maxPages) {
            page = this.maxPages;
        }

        this.tbody.empty();

        if (options.onFocusLost)
            options.onFocusLost();

        if(preset.length != 0){
            for (let i = (page - 1) * this.forPage; i < page * this.forPage; i++) {
                if (preset[i]) {
                    const row = options.row ? options.row(preset[i]) : createRow(preset[i]);
                    row.click(e => {
                        if (this.currentRow) {
                            this.currentRow.removeClass('selected');
                        }

                        row.addClass('selected');
                        options.click(i,  row, preset);
                        this.currentRow = row;
                    });
                    this.tbody.append(row);
                }
            }
        }else{
            this.tbody.append(`<tr> <td colspan="10"> <div class="emptypage"> There are no records </div> </td> </tr>`);
        }

        this.currentPage = page;
    }

    this.sortBy = (key, way = false) => {        
        if (this.searched) {
            sortPragma(this.searched, key, way);
            this.displayPage(this.currentPage, this.searched);
        } else {
            sortPragma(this.data.current, key, way);
            this.displayPage(this.currentPage);
        }
    }

    this.disableSort = () => {
        this.sortBy(options.defaultSort);
        this.recalculatePages();
        this.displayPage(this.currentPage, this.searched ? this.searched : this.data.current);
    }

    this.search = text => {
        this.searched = null;
        this.searched = [];

    
        this.searched = this.data.current.filter(row => Object.keys(row).some( key  => 
            {                 
                if(key == 'createdAt' || key == 'updatedAt'){
                    return (new Date(row[key]).toLocaleDateString().toLowerCase().indexOf(text) > -1)
                }
               
                if( typeof(row[key]) === 'object' && row[key]){              
                   Object.keys(row[key]).some(downkey => String(row[key][downkey]).toLowerCase().indexOf(text.toLowerCase()) > -1 );           
                }              

                return ( String(row[key]).toLowerCase().indexOf(text.toLowerCase()) > -1 )
            }
        ));
        this.sortBy(this.currentSortableId, this.currentSortableBool);

        this.recalculatePages();
        this.displayPage(1, this.searched);
    }

    this.disableSearch = () => {
        this.searched = null;
        this.recalculatePages();
        this.displayPage(1);

        this.currentSortableHeader.removeClass('up down');
        this.currentSortableId = null;
        this.currentSortableBool = null;
    }

    this.pagination = index => {

        if (index <= 0) {
            index = 1;
        } else if (index > this.maxPages) {
            index = this.maxPages;
        }


        this.currentPage = index;
        if (this.searched) {
            this.displayPage(index, this.searched);
        } else {
            this.displayPage(index, this.data.current);
        }

        $(options.input.to).val(index);
    }



    this.bNext = () => {
        this.currentPage = this.currentPage + 1;
        this.pagination(this.currentPage);
    }

    this.bPrevious = () => {
        this.currentPage = this.currentPage - 1;
        this.pagination(this.currentPage);
    }



    this.setUpUi = () => {
        $(options.search).on('change keyup', e => {
            if (e.target.value.length == 0) {
                this.disableSearch();
            } else {
                this.search(e.target.value);
            }
        });

        $(options.forPage).dropdown('set selected', 10);
        $(options.forPage).dropdown({ onChange: () => this.changeFor($(options.forPage).dropdown('get value')) });
        $(options.buttons.next).click(e => this.bNext());
        $(options.buttons.previous).click(e => this.bPrevious());

        const input = $(options.input.to);
        $(options.buttons.to).click(e => {
            let val = parseInt(input.val());
            if (isNaN(val))
                val = 1;

            this.pagination(val);
        });

        this.table.find('thead th[data-field]').each((i, elem) => this.createSortable($(elem)));
    }

    this.loadInSegment = (url, head,segment,callback) => {
        this.hashed = { url , head, segment }
        LoadSegment(url, head, segment)
            .then( answer => {segment.toggleClass('loading'); this.forceLoad(answer.result.data); });
    }

    this.loadFromCache = () => {
        this.forceClearSortable();
        LoadSegment(this.hashed.url, this.hashed.head, this.hashed.segment)
            .then( answer => { this.hashed.segment.toggleClass('loading'); this.forceLoad(answer.result.data); });
    }

    this.setUpUi();


    function createRow(item) {
        let template = `<tr>`
        Object.values(item).forEach(e => template += `<td>${e}</td>`)
        template += `</tr>`
        return $(template);
    }


    function sortPragma(arr, key, way) {
        arr.sort((current, other) => {
            var a = current[key],
                b = other[key];

            if (way) {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            } else {
                if (a > b) return -1;
                if (a < b) return 1;
                return 0;
            }
        });
    }

    this.hashed;
}

function NestedList(id, options) {
    this.body = $(id);
    this.place = this.body.find(options.listplace);
    this.submiter =  this.body.find(options.submiter);
    this.result = {};
    this.files = {};
    this.current = 0;
    
    if(options.isFiled){
        this.files.path = this.body.find(`input[name=${options.isFiled.pathName}]`);
        this.files.input = this.body.find(`input[name=${options.isFiled.inputName}]`);
        this.files.button = this.body.find(`button[name=${options.isFiled.buttonName}]`);

        this.files.button.click( e => this.files.input.click());
        this.files.input.on('change', e => this.readFile(this.files.input,this.files.path, this.loadUri ))
    }
 

    this.validate = () => {
        let result = {};
        let valid = true;

        options.inputs.forEach(obj => {
            let input = $(this.body.find(`input[name=${obj.name}]`));         
            let parent = input.parent();
            
            if (!obj.valid(input.val())) {
                parent.addClass('error');
                valid = false;
            } else {
                parent.removeClass('error');
                result[obj.as ? obj.as : obj.name ] = input.val();
            }
        });

        if(valid == true){
            options.inputs.forEach(obj => $(this.body.find(`input[name=${obj.name}]`).val('')));
        }

        if(options.isFiled){
            result.image =  this.files.currentFile;
            result.uri = this.files.currentUrl;
        }

        return { valid : valid, data : result};
    }

    this.submiter.click( e => {
        const vd = this.validate();             

        if(!vd.valid)
            return;

        if(this.result[vd.data.title + vd.data.value])
            return;
        
        this.place.append(options.mockuper(vd.data,vd.data.title + vd.data.value));      
        this.result[vd.data.value] = vd.data;

    });
    
    this.getData = () => this.result;

    this.forceDelete = id => delete this.result[id];

    this.forceEmpty = () => {
        this.result = {};
        this.place.empty();
    }

    this.readFile = (input,placeholder,callback) => {   
       var reader = new FileReader();        
       this.files.currentFile = input[0].files[0];

       if (input[0].files[0]) {  
         placeholder.val(input[0].files[0].name)
        
         reader.onload = e => callback(e.target.result);   
         reader.readAsDataURL(input[0].files[0]);
       }
    }

    this.loadUri = uri => this.files.currentUrl = uri ;
}