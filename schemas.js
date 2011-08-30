(function($) {
    if (!jQuery.microdata) {
        console.error('jQuery Microdata plugin has not been loaded prior to loading this script!');
        return;
    }
    
    function extend(base, additions) {
        var ret = base.fields.slice();
        for (var i = 0; i < additions.length; i++) {
            if (!findField(additions[i].name))
                ret.fields.push(additions[i]);
        }
        
        function fieldField(name) {
            for (var i = 0; i < ret.fields.length; i++) {
                if (ret.fields[i].name == name) return ret.fields[i];
            }
            return false;
        }
    }
    
    function findByUrl(source, url) {
        for (var i = 0; i < source.fields.length; i++) {
            if (source[i].url == url) return source[i];
        }
        return null;
    }
    
    
    var dataVocabulary = [
        {
            url: "http://data-vocabulary.org/Event",
            fields: [
                 { name: "summary",     required: true,  type: "text",     validator: validators.text     },
                 { name: "url",         required: false, type: "url",      validator: validators.url      },
                 { name: "location",    required: false, type: "complex",  validator: validators.complex  }, // optionally represented by data-vocabulary.org/Organization or data-vocabulary.org/Address
                 { name: "description", required: false, type: "text",     validator: validators.text     },
                 { name: "startdate",   required: true,  type: "datetime", validator: validators.datetime },
                 { name: "enddate",     required: false, type: "datetime", validator: validators.datetime },
                 { name: "duration",    required: false, type: "duration", validator: validators.duration },
                 { name: "eventtype",   required: false, type: "text",     validator: validators.text     },
                 { name: "geo",         required: false, type: "complex",  validator: validators.complex  }, // represented by itemscope with two properties: latitude and longitude
                 { name: "photo",       required: false, type: "url",      validator: validators.url      } 
            ]
        },
        {
            url: "http://data-vocabulary.org/Person",
            fields: [
                 { name: "name",         required: false, type: "text",    validator: validators.text    },
                 { name: "fn",           required: false, type: "text",    validator: validators.text    }, // alias for "name"
                 { name: "nickname",     required: false, type: "text",    validator: validators.text    },
                 { name: "photo",        required: false, type: "url",     validator: validators.url     },
                 { name: "title",        required: false, type: "text",    validator: validators.text    },
                 { name: "role",         required: false, type: "text",    validator: validators.text    },
                 { name: "url",          required: false, type: "url",     validator: validators.url     },
                 { name: "affiliation",  required: false, type: "text",    validator: validators.text    },
                 { name: "org",          required: false, type: "text",    validator: validators.text    }, // alias for "affiliation"
                 { name: "address",      required: false, type: "complex", validator: validators.complex }, // can have subproperties street-address, city, region, postal-code, country-name
                 { name: "adr",          required: false, type: "complex", validator: validators.complex }, // alias for "address"
                 { name: "friend",       required: false, type: "url",     validator: validators.url     },
                 { name: "contact",      required: false, type: "url",     validator: validators.url     },
                 { name: "acquaintance", required: false, type: "url",     validator: validators.url     }
                 // NOTE: to define "friend", "contact" or "acquaintance", you can also use XFN rel="..."
            ]
        },
        {
            url: "http://data-vocabulary.org/Organization",
            fields: [
                 { name: "name",    required: false, type: "text",    validator: validators.text    },
                 { name: "fn",      required: false, type: "text",    validator: validators.text    }, // alias for "name"
                 { name: "org",     required: false, type: "text",    validator: validators.text    }, // alias for "name"
                 { name: "url",     required: false, type: "url",     validator: validators.url     },
                 { name: "address", required: false, type: "complex", validator: validators.complex },
                 { name: "adr",     required: false, type: "complex", validator: validators.complex }, // alias for "address"
                 { name: "tel",     required: false, type: "text",    validator: validators.text    },
                 { name: "geo",     required: false, type: "complex", validator: validators.complex }
            ]
        },
        {
            url: "http://data-vocabulary.org/Offer",
            fields: [
                 { name: "price",           required: false, type: "float",    validator: validators.float    },
                 { name: "currency",        required: false, type: "text",     validator: validators.currency },
                 { name: "pricevaliduntil", required: false, type: "datetime", validator: validators.datetime },
                 { name: "seller",          required: false, type: "complex",  validator: validators.complex  }, // can contain a Person or Organization
                 {
                     name: "condition",     required: false, type: "complex",
                     validator: function(value, el) {
                         return $(el).hasAttr('content') && $.inArray($(el).attr('content').toLowerCase(), ["new", "used", "refurbished"]);
                     }
                 }, 
                 {
                     name: "availability",  required: false, type: "complex",
                     validator: function(value, el) { 
                         return $(el).hasAttr('content') && $.inArray($(el).attr('content').toLowerCase(), ["out_of_stock", "in_stock", "instore_only", "preorder"]);
                     }
                 },
                 { name: "offerurl",        required: false, type: "url",      validator: validators.url      }, // points to a product web page that includes the offer
                 { name: "identifier",      required: false, type: "text",     validator: validators.text     }, // recognizes ASIN, ISBN, MPN, UPC, SKU; suggests including product prand and at least one of the identifiers
                 { name: "itemoffered",     required: false, type: "complex",  validator: validators.complex  }  // can contain free text, a Product or other item types
            ]
        }
    ];
    
    for (var i = 0; i < dataVocabulary.length; i++) {
        $.microdata.addDefinition(dataVocabulary[i].url, dataVocabulary[i].fields);
    }
})(jQuery);